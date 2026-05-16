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
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, code, name, description, unit_price, stock, status FROM products WHERE status = 'activo'")
        
        productos = []
        for row in cursor.fetchall():
            productos.append({
                "id": row.id,
                "code": row.code,
                "name": row.name,
                "description": row.description,
                "unit_price": float(row.unit_price),
                "stock": row.stock,
                "status": row.status
            })
            
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": productos})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()