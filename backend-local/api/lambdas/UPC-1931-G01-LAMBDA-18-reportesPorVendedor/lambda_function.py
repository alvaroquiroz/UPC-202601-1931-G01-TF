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

        cursor.execute("""
            SELECT 
                u.first_name + ' ' + u.last_name AS vendedor,
                u.email,
                COUNT(q.id) AS total_cotizaciones,
                SUM(CASE WHEN qs.name = 'Aprobada' THEN 1 ELSE 0 END) AS aprobadas,
                SUM(CASE WHEN qs.name = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
                SUM(CASE WHEN qs.name = 'Rechazada' THEN 1 ELSE 0 END) AS rechazadas,
                SUM(CASE WHEN qs.name = 'Observada' THEN 1 ELSE 0 END) AS observadas,
                SUM(q.total) AS monto_total
            FROM quotations q
            INNER JOIN users u ON q.vendor_user_id = u.id
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            GROUP BY u.id, u.first_name, u.last_name, u.email
            ORDER BY total_cotizaciones DESC
        """)

        vendedores = []
        for row in cursor.fetchall():
            vendedores.append({
                "vendedor":           row.vendedor,
                "email":              row.email,
                "total_cotizaciones": row.total_cotizaciones,
                "aprobadas":          row.aprobadas,
                "pendientes":         row.pendientes,
                "rechazadas":         row.rechazadas,
                "observadas":         row.observadas,
                "monto_total":        float(row.monto_total)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": vendedores})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()