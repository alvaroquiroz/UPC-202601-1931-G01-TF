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
            SELECT q.id, q.code, q.quotation_date, q.subtotal, q.igv, q.total,
                    q.general_comment, q.sent_at, q.reviewed_at,
                    qs.name AS estado,
                    u.first_name + ' ' + u.last_name AS cliente,
                    u.email AS correo_cliente,
                    u.phone AS telefono
            FROM quotations q
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            INNER JOIN users u ON q.client_user_id = u.id
            WHERE q.id = ?
        """, [id])

        row = cursor.fetchone()
        if not row:
            return {'statusCode': 404, 'body': json.dumps({"error": "Cotización no encontrada"})}

        cotizacion = {
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
            "telefono":        row.telefono or ''
        }

        cursor.execute("""
            SELECT p.name AS producto, p.code, qi.quantity, qi.unit_price,
                    qi.line_subtotal, qi.line_igv, qi.line_total
            FROM quotation_items qi
            INNER JOIN products p ON qi.product_id = p.id
            WHERE qi.quotation_id = ?
        """, [id])

        productos = []
        for item in cursor.fetchall():
            productos.append({
                "producto":      item.producto,
                "code":          item.code,
                "quantity":      item.quantity,
                "unit_price":    float(item.unit_price),
                "line_subtotal": float(item.line_subtotal),
                "line_igv":      float(item.line_igv),
                "line_total":    float(item.line_total)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"cotizacion": cotizacion, "productos": productos})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()