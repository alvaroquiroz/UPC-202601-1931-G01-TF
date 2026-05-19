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

        first_name = body.get("first_name", "").strip()
        last_name = body.get("last_name", "").strip()
        email = body.get("email", "").strip().lower()
        phone = body.get("phone", "").strip()
        empresa = body.get("empresa", "").strip()
        password = body.get("password", "").strip()
        accepted_terms = body.get("accepted_terms", False)

        if not first_name or not last_name or not email or not password:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "Nombre, apellido, correo y contraseña son obligatorios"
                })
            }

        if len(password) < 6:
          return {
              "statusCode": 400,
              "headers": {
                  "Access-Control-Allow-Origin": DEFAULT_ORIGIN
              },
              "body": json.dumps({
                  "message": "La contraseña debe tener al menos 6 caracteres"
              })
          }

        if not accepted_terms:
          return {
              "statusCode": 400,
              "headers": {
                  "Access-Control-Allow-Origin": DEFAULT_ORIGIN
              },
              "body": json.dumps({
                  "message": "Debes aceptar los términos y condiciones"
              })
          }

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "statusCode": 409,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "El correo ya está registrado"
                })
            }

        cursor.execute("SELECT id FROM roles WHERE name = 'cliente'")
        role_row = cursor.fetchone()

        if not role_row:
            return {
                "statusCode": 500,
                "headers": {
                    "Access-Control-Allow-Origin": DEFAULT_ORIGIN
                },
                "body": json.dumps({
                    "message": "No existe el rol cliente en la base de datos"
                })
            }

        role_id = role_row.id
        password_hash = hash_password(password)

        cursor.execute("""
            INSERT INTO users (
                role_id,
                first_name,
                last_name,
                email,
                password,
                phone,
                empresa,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')
        """, (
            role_id,
            first_name,
            last_name,
            email,
            password_hash,
            phone if phone else None,
            empresa if empresa else None
        ))

        conn.commit()

        return {
            "statusCode": 201,
            "headers": {
                "Access-Control-Allow-Origin": DEFAULT_ORIGIN
            },
            "body": json.dumps({
                "message": "Cuenta creada correctamente"
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
