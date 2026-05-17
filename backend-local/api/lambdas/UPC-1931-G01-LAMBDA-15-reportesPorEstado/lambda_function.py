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
            SELECT qs.name AS estado, COUNT(q.id) AS total,
                    SUM(q.total) AS monto_total
            FROM quotations q
            INNER JOIN quotation_statuses qs ON q.status_id = qs.id
            GROUP BY qs.name
            ORDER BY total DESC
        """)

        estados = []
        for row in cursor.fetchall():
            estados.append({
                "estado":      row.estado,
                "total":       row.total,
                "monto_total": float(row.monto_total)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": estados})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()