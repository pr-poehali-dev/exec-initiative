import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p92715436_exec_initiative')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация, вход, выход, проверка сессии."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    conn = get_conn()
    cur = conn.cursor()

    # POST /register
    if method == 'POST' and path.endswith('/register'):
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        name = body.get('name', '').strip()

        if not email or not password:
            conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Email и пароль обязательны'})}

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
        if cur.fetchone():
            conn.close()
            return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Пользователь уже существует'})}

        ph = hash_password(password)
        cur.execute(f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES ('{email}', '{ph}', '{name}') RETURNING id")
        user_id = cur.fetchone()[0]

        token = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{token}')")
        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'token': token, 'user': {'id': user_id, 'email': email, 'name': name}})
        }

    # POST /login
    if method == 'POST' and path.endswith('/login'):
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        ph = hash_password(password)

        cur.execute(f"SELECT id, email, name FROM {SCHEMA}.users WHERE email = '{email}' AND password_hash = '{ph}'")
        row = cur.fetchone()
        if not row:
            conn.close()
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        user_id, user_email, user_name = row
        token = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{token}')")
        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'token': token, 'user': {'id': user_id, 'email': user_email, 'name': user_name}})
        }

    # GET /me
    if method == 'GET' and path.endswith('/me'):
        token = event.get('headers', {}).get('X-Auth-Token', '')
        if not token:
            conn.close()
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Не авторизован'})}

        cur.execute(f"""
            SELECT u.id, u.email, u.name FROM {SCHEMA}.users u
            JOIN {SCHEMA}.sessions s ON s.user_id = u.id
            WHERE s.token = '{token}'
        """)
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Сессия недействительна'})}

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'user': {'id': row[0], 'email': row[1], 'name': row[2]}})
        }

    # POST /logout
    if method == 'POST' and path.endswith('/logout'):
        token = event.get('headers', {}).get('X-Auth-Token', '')
        if token:
            cur.execute(f"UPDATE {SCHEMA}.sessions SET token = '' WHERE token = '{token}'")
            conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    conn.close()
    return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Not found'})}
