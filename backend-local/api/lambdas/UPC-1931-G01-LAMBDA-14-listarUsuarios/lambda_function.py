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

        role_filter = event.get('queryStringParameters', {}).get('role')

        query = """
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
                    u.empresa, u.status, r.name AS role,
                    u.created_at
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
        """

        if role_filter:
            query += " WHERE r.name = ? ORDER BY u.created_at DESC"
            cursor.execute(query, [role_filter])

        else:
            query += " ORDER BY u.created_at DESC"
            cursor.execute(query)

        usuarios = []
        for row in cursor.fetchall():
            usuarios.append({
                "id":         row.id,
                "first_name": row.first_name,
                "last_name":  row.last_name,
                "email":      row.email,
                "phone":      row.phone or '',
                "empresa":    row.empresa or '',
                "status":     row.status,
                "role":       row.role,
                "created_at": str(row.created_at)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": usuarios})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()