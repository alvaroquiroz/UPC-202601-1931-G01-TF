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
                u.first_name + ' ' + u.last_name AS cliente,
                u.email,
                u.empresa,
                COUNT(q.id) AS total_cotizaciones,
                SUM(q.total) AS monto_total
            FROM quotations q
            INNER JOIN users u ON q.client_user_id = u.id
            GROUP BY u.id, u.first_name, u.last_name, u.email, u.empresa
            ORDER BY total_cotizaciones DESC
        """)

        clientes = []
        for row in cursor.fetchall():
            clientes.append({
                "cliente":            row.cliente,
                "email":              row.email,
                "empresa":            row.empresa or '',
                "total_cotizaciones": row.total_cotizaciones,
                "monto_total":        float(row.monto_total)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": clientes})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()