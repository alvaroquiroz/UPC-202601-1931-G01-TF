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
        id      = event.get('pathParameters', {}).get('id')
        body    = json.loads(event.get('body') or '{}')
        user_id = body.get('user_id')
        comment = body.get('comment', '').strip()

        if not comment:
            return {'statusCode': 400, 'body': json.dumps({"error": "El comentario es obligatorio al solicitar cambios"})}

        cursor.execute("""
            SELECT q.status_id, qs.name AS estado
            FROM quotations q
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            WHERE q.id = ?
        """, [id])

        row = cursor.fetchone()
        if row.estado != 'Pendiente':
            return {'statusCode': 400, 'body': json.dumps({"error": "Solo se pueden observar cotizaciones en estado Pendiente"})}

        prev_status_id = row.status_id

        cursor.execute("SELECT id FROM quotation_statuses WHERE name = 'Observada'")
        new_status_id = cursor.fetchone().id

        cursor.execute("""
            UPDATE quotations
            SET status_id = ?, vendor_user_id = ?,
                updated_at = GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time'
            WHERE id = ?
        """, [new_status_id, user_id, id])

        cursor.execute("""
            INSERT INTO quotation_observations (quotation_id, user_id, comment)
            VALUES (?, ?, ?)
        """, [id, user_id, comment])

        cursor.execute("""
            INSERT INTO quotation_status_history
                (quotation_id, previous_status_id, new_status_id, changed_by_user_id, comment)
            VALUES (?, ?, ?, ?, ?)
        """, [id, prev_status_id, new_status_id, user_id, comment])

        conn.commit()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"message": "Cambios solicitados correctamente"})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()