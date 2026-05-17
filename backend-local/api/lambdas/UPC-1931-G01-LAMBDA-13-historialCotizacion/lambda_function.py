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
        id = event.get('pathParameters', {}).get('id')

        cursor.execute("""
            SELECT h.changed_at, h.comment,
                    ps.name AS estado_anterior,
                    ns.name AS estado_nuevo,
                    u.first_name + ' ' + u.last_name AS cambiado_por
            FROM quotation_status_history h
            INNER JOIN quotation_statuses ps ON h.previous_status_id = ps.id
            INNER JOIN quotation_statuses ns ON h.new_status_id      = ns.id
            INNER JOIN users u               ON h.changed_by_user_id = u.id
            WHERE h.quotation_id = ?
            ORDER BY h.changed_at DESC
        """, [id])

        historial = []
        for row in cursor.fetchall():
            historial.append({
                "estado_anterior": row.estado_anterior,
                "estado_nuevo":    row.estado_nuevo,
                "cambiado_por":    row.cambiado_por,
                "changed_at":      str(row.changed_at),
                "comment":         row.comment or ''
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": historial})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()