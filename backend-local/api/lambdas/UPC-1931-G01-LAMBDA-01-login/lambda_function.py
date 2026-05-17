import pyodbc
import os
import json

def get_db_connection():
    server = os.environ.get('DB_SERVER')
    database = os.environ.get('DB_NAME')
    username = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')

    conn_str = (
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        f"TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)

def lambda_handler(event, context):
    conn = None
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email", "").strip()
        password = body.get("password", "").strip()

        if not email or not password:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Correo y contraseña son obligatorios"})
            }

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                u.id,
                u.email,
                u.password,
                u.first_name,
                u.last_name,
                r.name AS role
            FROM users u
            INNER JOIN roles r ON r.id = u.role_id
            WHERE u.email = ? AND u.status = 'activo'
        """, (email,))

        row = cursor.fetchone()

        if not row:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Credenciales incorrectas"})
            }

        # MVP simple: comparación directa de contraseña
        if row.password != password:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Credenciales incorrectas"})
            }

        user_data = {
            "id": row.id,
            "email": row.email,
            "name": f"{row.first_name} {row.last_name}",
            "role": row.role
        }

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Login correcto",
                "data": user_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error interno", "error": str(e)})
        }
    finally:
        if conn:
            conn.close()
