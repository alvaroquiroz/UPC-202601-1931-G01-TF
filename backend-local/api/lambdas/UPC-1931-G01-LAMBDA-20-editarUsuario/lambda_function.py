import pyodbc
import os
import json

def get_db_connection():
    server   = os.environ.get('DB_SERVER')
    database = os.environ.get('DB_NAME')
    username = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')
    conn_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes;'
    return pyodbc.connect(conn_str)

def lambda_handler(event, context):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        id   = event.get('pathParameters', {}).get('id')
        body = json.loads(event.get('body') or '{}')

        first_name = body.get('first_name')
        last_name  = body.get('last_name')
        email      = body.get('email')
        phone      = body.get('phone')
        empresa    = body.get('empresa')

        cursor.execute("""
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?,
                phone = ?, empresa = ?, updated_at = GETDATE()
            WHERE id = ?
        """, [first_name, last_name, email, phone, empresa, id])

        conn.commit()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"message": "Usuario actualizado correctamente"})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()