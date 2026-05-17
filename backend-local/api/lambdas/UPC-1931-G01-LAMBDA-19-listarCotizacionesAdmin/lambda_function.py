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

        status = event.get('queryStringParameters', {}).get('status')

        query = """
            SELECT q.id, q.code, q.quotation_date, q.subtotal, q.igv, q.total,
                    q.general_comment,
                    qs.name AS estado,
                    uc.first_name + ' ' + uc.last_name AS cliente,
                    uc.email AS correo_cliente,
                    uc.phone AS telefono_cliente,
                    uc.empresa AS empresa_cliente,
                    uv.first_name + ' ' + uv.last_name AS vendedor,
                    uv.email AS correo_vendedor
            FROM quotations q
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            INNER JOIN users uc ON q.client_user_id = uc.id
            LEFT JOIN users uv ON q.vendor_user_id = uv.id
        """

        if status:
            query += " WHERE qs.name = ?"
            cursor.execute(query + " ORDER BY q.created_at DESC", [status])
        else:
            cursor.execute(query + " ORDER BY q.created_at DESC")

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
                "telefono_cliente": row.telefono_cliente or '',
                "empresa_cliente": row.empresa_cliente or '',
                "vendedor":        row.vendedor or 'Sin asignar',
                "correo_vendedor": row.correo_vendedor or ''
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
