
import pyodbc
import os
import json
from security import hash_password

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:4200").split(",")
    if origin.strip()
]
DEFAULT_ORIGIN = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "*"

def get_db_connection():
    server = os.environ.get("DB_SERVER")
    database = os.environ.get("DB_NAME")
    username = os.environ.get("DB_USER")
    password = os.environ.get("DB_PASSWORD")

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
        token = body.get("token", "").strip()
        password = body.get("password", "").strip()

        if not token or not password:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "Token y nueva contraseña son obligatorios"
                })
            }

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT TOP 1 id, user_id
            FROM password_resets
            WHERE token = ?
              AND used_at IS NULL
              AND expires_at > GETDATE()
            ORDER BY created_at DESC
        """, (token,))
        reset_row = cursor.fetchone()

        if not reset_row:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "El enlace es inválido o ha expirado"
                })
            }

        password_hash = hash_password(password)

        cursor.execute("""
            UPDATE users
            SET password = ?, updated_at = GETDATE()
            WHERE id = ?
        """, (password_hash, reset_row.user_id))

        cursor.execute("""
            UPDATE password_resets
            SET used_at = GETDATE()
            WHERE id = ?
        """, (reset_row.id,))

        conn.commit()

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": DEFAULT_ORIGIN
            },
            "body": json.dumps({
                "message": "La contraseña fue actualizada correctamente"
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": DEFAULT_ORIGIN
            },
            "body": json.dumps({
                "message": "Error interno",
                "error": str(e)
            })
        }
    finally:
        if conn:
            conn.close()
