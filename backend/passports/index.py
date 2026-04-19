import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p92715436_exec_initiative')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_id(cur, token: str):
    cur.execute(f"""
        SELECT u.id FROM {SCHEMA}.users u
        JOIN {SCHEMA}.sessions s ON s.user_id = u.id
        WHERE s.token = '{token}'
    """)
    row = cur.fetchone()
    return row[0] if row else None

def handler(event: dict, context) -> dict:
    """Паспорта: сохранение и получение энергопаспортов пользователя."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    token = (event.get('headers') or {}).get('X-Auth-Token', '')
    params = event.get('queryStringParameters') or {}

    conn = get_conn()
    cur = conn.cursor()

    # Публичный счётчик — без авторизации
    if method == 'GET' and params.get('action') == 'count':
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.passports")
        total = cur.fetchone()[0]
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'count': total})}

    if not token:
        conn.close()
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Не авторизован'})}

    user_id = get_user_id(cur, token)
    if not user_id:
        conn.close()
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Сессия недействительна'})}

    # GET — список паспортов пользователя
    if method == 'GET':
        cur.execute(f"""
            SELECT id, name, address, area, year, floors, grade, date, image_url, created_at
            FROM {SCHEMA}.passports
            WHERE user_id = {user_id}
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        passports = [
            {
                'id': r[0], 'name': r[1], 'address': r[2], 'area': r[3],
                'year': r[4], 'floors': r[5], 'grade': r[6], 'date': r[7],
                'imagePreview': r[8]
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'passports': passports})}

    # POST — сохранить паспорт
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').replace("'", "''")
        address = body.get('address', '').replace("'", "''")
        area = body.get('area', '').replace("'", "''")
        year = body.get('year', '').replace("'", "''")
        floors = body.get('floors', '').replace("'", "''")
        grade = body.get('grade', '').replace("'", "''")
        date = body.get('date', '').replace("'", "''")
        image_url = body.get('imagePreview', '') or ''
        image_url = image_url.replace("'", "''")[:500]

        cur.execute(f"""
            INSERT INTO {SCHEMA}.passports (user_id, name, address, area, year, floors, grade, date, image_url)
            VALUES ({user_id}, '{name}', '{address}', '{area}', '{year}', '{floors}', '{grade}', '{date}', '{image_url}')
            RETURNING id
        """)
        passport_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': passport_id, 'ok': True})}

    conn.close()
    return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Not found'})}