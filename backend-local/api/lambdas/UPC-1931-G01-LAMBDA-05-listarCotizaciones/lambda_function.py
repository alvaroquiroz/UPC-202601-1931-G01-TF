import pyodbc
import os
import json

def get_db_connection():
    server = os.environ.get('DB_SERVER')
    database = os.environ.get('DB_NAME')
    username = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')
    conn_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes;'
    return pyodbc.connect(conn_str)

def lambda_handler(event, context):
    conn = None
    try:
        qs_params = event.get('queryStringParameters') or {}
        cliente_id = qs_params.get('clienteId')
        
        if not cliente_id:
            return {'statusCode': 400, 'body': json.dumps({"error": "Falta el parámetro clienteId"})}
            
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT c.id, c.code, c.quotation_date, c.total, s.name as estado,
               (SELECT COUNT(*) FROM quotation_items WHERE quotation_id = c.id) as total_productos
        FROM quotations c
        JOIN quotation_statuses s ON c.status_id = s.id
        WHERE c.client_user_id = ?
        ORDER BY c.created_at DESC
        """
        cursor.execute(query, (cliente_id,))
        
        cotizaciones = []
        for row in cursor.fetchall():
            cotizaciones.append({
                "id": row.code,
                "db_id": row.id,
                "fecha": row.quotation_date.strftime('%Y-%m-%d'),
                "total": f"S/. {float(row.total):.2f}",
                "estado": row.estado,
                "productos": row.total_productos
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