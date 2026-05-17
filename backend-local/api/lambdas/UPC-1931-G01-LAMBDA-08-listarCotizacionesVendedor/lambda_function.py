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

        vendor_id = event.get('queryStringParameters', {}).get('vendor_id')
        status    = event.get('queryStringParameters', {}).get('status')

        query = """
            SELECT q.id, q.code, q.quotation_date, q.subtotal, q.igv, q.total,
                    q.general_comment, q.sent_at,
                    qs.name AS estado,
                    u.first_name + ' ' + u.last_name AS cliente,
                    u.email AS correo_cliente,
                    u.phone AS telefono,
                    u.empresa AS empresa
            FROM quotations q
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            INNER JOIN users u ON q.client_user_id = u.id
            WHERE (q.vendor_user_id = ? OR q.vendor_user_id IS NULL)
        """
        params = [vendor_id]

        if status:
            query += " AND qs.name = ?"
            params.append(status)

        query += " ORDER BY q.created_at DESC"

        cursor.execute(query, params)

        cotizaciones = []
        for row in cursor.fetchall():
            cotizaciones.append({
                "id":              row.id,
                "code":            row.code,
                "quotation_date":  str(row.quotation_date),
                "subtotal":        float(row.subtotal),
                "igv":             float(row.igv),
                "total":           float(row.total),
                "general_comment": row.general_comment or '',
                "estado":          row.estado,
                "cliente":         row.cliente,
                "correo_cliente":  row.correo_cliente,
                "telefono":        row.telefono or '',
                "empresa":         row.empresa or ''
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": cotizaciones})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()