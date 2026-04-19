import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p92715436_exec_initiative')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_admin_user(cur, token: str):
    cur.execute(f"""
        SELECT u.id, u.role FROM {SCHEMA}.users u
        JOIN {SCHEMA}.sessions s ON s.user_id = u.id
        WHERE s.token = '{token}'
    """)
    row = cur.fetchone()
    if not row or row[1] != 'admin':
        return None
    return row[0]

def handler(event: dict, context) -> dict:
    """Админ-панель: список пользователей и паспортов. Только для роли admin."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    token = (event.get('headers') or {}).get('X-Auth-Token', '')
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body') or '{}')

    conn = get_conn()
    cur = conn.cursor()

    admin_id = get_admin_user(cur, token)
    if not admin_id:
        conn.close()
        return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Доступ запрещён'})}

    action = params.get('action') or body.get('action', '')

    # Список пользователей
    if action == 'users':
        cur.execute(f"""
            SELECT u.id, u.email, u.name, u.role, u.created_at,
                   COUNT(p.id) as passport_count
            FROM {SCHEMA}.users u
            LEFT JOIN {SCHEMA}.passports p ON p.user_id = u.id
            GROUP BY u.id, u.email, u.name, u.role, u.created_at
            ORDER BY u.created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        users = [
            {'id': r[0], 'email': r[1], 'name': r[2], 'role': r[3],
             'created_at': str(r[4])[:10], 'passport_count': r[5]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'users': users})}

    # Список всех паспортов
    if action == 'passports':
        cur.execute(f"""
            SELECT p.id, p.name, p.address, p.area, p.year, p.floors,
                   p.grade, p.date, p.created_at, u.email
            FROM {SCHEMA}.passports p
            JOIN {SCHEMA}.users u ON u.id = p.user_id
            ORDER BY p.created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        passports = [
            {'id': r[0], 'name': r[1], 'address': r[2], 'area': r[3],
             'year': r[4], 'floors': r[5], 'grade': r[6], 'date': r[7],
             'created_at': str(r[8])[:10], 'user_email': r[9]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'passports': passports})}

    # Изменить роль пользователя
    if method == 'POST' and action == 'set_role':
        user_id = body.get('user_id')
        role = body.get('role', 'user')
        if role not in ('user', 'admin'):
            conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Недопустимая роль'})}
        cur.execute(f"UPDATE {SCHEMA}.users SET role = '{role}' WHERE id = {int(user_id)}")
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    conn.close()
    return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Not found'})}
