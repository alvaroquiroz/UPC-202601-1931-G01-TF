import pyodbc
import os
import json
import secrets

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:4200").split(",")
    if origin.strip()
]
DEFAULT_ORIGIN = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "*"

APP_ENV = os.environ.get("APP_ENV", "local")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:4200")

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
        email = body.get("email", "").strip().lower()

        if not email:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "El correo es obligatorio"
                })
            }

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id
            FROM users
            WHERE email = ? AND status = 'activo'
        """, (email,))
        user = cursor.fetchone()

        # Respuesta genérica por seguridad
        response_body = {
            "message": "Si el correo existe, te enviamos instrucciones para restablecer tu contraseña"
        }

        if user:
            token = secrets.token_urlsafe(32)

            cursor.execute("""
                INSERT INTO password_resets (user_id, token, expires_at, created_at)
                VALUES (?, ?, DATEADD(MINUTE, 30, GETDATE()), GETDATE())
            """, (user.id, token))

            conn.commit()

            reset_url = f"{FRONTEND_URL}/restablecer-password/{token}"

            # En local devolvemos el link para pruebas
            if APP_ENV == "local":
                response_body["data"] = {
                    "reset_url": reset_url,
                    "token": token
                }

            # En AWS luego aquí enviarías el correo con SES

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": DEFAULT_ORIGIN
            },
            "body": json.dumps(response_body)
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
