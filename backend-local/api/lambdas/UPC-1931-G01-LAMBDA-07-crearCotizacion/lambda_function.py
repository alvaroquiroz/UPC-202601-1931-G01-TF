import pyodbc
import os
import json
import time

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
        body = json.loads(event.get('body', '{}'))
        cliente_id = body.get('clienteId')
        productos = body.get('productos', [])
        observaciones = body.get('observaciones', '')
        subtotal = body.get('subtotal', 0)
        igv = body.get('igv', 0)
        total = body.get('total', 0)
        
        if not cliente_id or len(productos) == 0:
            return {'statusCode': 400, 'body': json.dumps({"error": "Datos incompletos"})}

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM quotations")
        total_cots = cursor.fetchone()[0] + 1
        code = f"COT-{total_cots:03d}"
        
        cursor.execute("""
            INSERT INTO quotations (code, client_user_id, status_id, subtotal, igv, total, general_comment, sent_at, created_at, updated_at)
            OUTPUT INSERTED.id
            VALUES (?, ?, 2, ?, ?, ?, ?,
                GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time',
                GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time',
                GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'SA Pacific Standard Time')
        """, (code, cliente_id, subtotal, igv, total, observaciones))
        cotizacion_id = cursor.fetchone()[0]
        
        for p in productos:
            p_subtotal = p['precio'] * p['cantidad']
            p_igv = p_subtotal * 0.18
            p_total = p_subtotal + p_igv
            cursor.execute("""
                INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, line_subtotal, line_igv, line_total)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (cotizacion_id, p['id'], p['cantidad'], p['precio'], p_subtotal, p_igv, p_total))
            
        conn.commit()
            
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                "mensaje": "Cotización creada exitosamente",
                "code": code
            })
        }
    except Exception as e:
        if conn: conn.rollback()
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()