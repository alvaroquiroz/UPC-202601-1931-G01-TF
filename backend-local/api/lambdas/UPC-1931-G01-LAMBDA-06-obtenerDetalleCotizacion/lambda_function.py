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
        path_params = event.get('pathParameters') or {}
        qs_params = event.get('queryStringParameters') or {}
        
        cot_id = path_params.get('id') or qs_params.get('id') or event.get('id')
        if not cot_id and event.get('path'):
            cot_id = event['path'].split('/')[-1]
            
        conn = get_db_connection()
        cursor = conn.cursor()
        row = None
        
        if str(cot_id).isdigit():
            cursor.execute("""
                SELECT c.id, c.code, c.quotation_date, c.total, c.general_comment,
                        s.name as estado,
                        u.first_name + ' ' + u.last_name AS nombre_cliente,
                        u.email AS correo_cliente,
                        u.phone AS telefono_cliente,
                        u.empresa AS empresa_cliente
                FROM quotations c
                JOIN quotation_statuses s ON c.status_id = s.id
                JOIN users u ON c.client_user_id = u.id
                WHERE c.id = ?
            """, (int(cot_id),))
        else:
            cursor.execute("""
                SELECT c.id, c.code, c.quotation_date, c.total, c.general_comment,
                        s.name as estado,
                        u.first_name + ' ' + u.last_name AS nombre_cliente,
                        u.email AS correo_cliente,
                        u.phone AS telefono_cliente,
                        u.empresa AS empresa_cliente
                FROM quotations c
                JOIN quotation_statuses s ON c.status_id = s.id
                JOIN users u ON c.client_user_id = u.id
                WHERE c.code = ?
            """, (str(cot_id),))

        row = cursor.fetchone()

        if not row:
            return {
                'statusCode': 404,
                'body': json.dumps({"error": f"Cotizacion {cot_id} no encontrada"})
            }
            
        db_id = row.id
        code = row.code
        estado = row.estado
        total_float = float(row.total) if row.total else 0.0
        general_comment = row.general_comment or ''
        
        if row.quotation_date and hasattr(row.quotation_date, 'strftime'):
            fecha = row.quotation_date.strftime('%Y-%m-%d')
        else:
            fecha = str(row.quotation_date) if row.quotation_date else ''
        
        lista_productos = []
        cursor.execute("""
            SELECT p.name, i.quantity, i.unit_price
            FROM quotation_items i
            JOIN products p ON i.product_id = p.id
            WHERE i.quotation_id = ?
        """, (db_id,))

        for p_row in cursor.fetchall():
            lista_productos.append({
                "nombre":     p_row.name,
                "producto":   p_row.name,
                "cantidad":   p_row.quantity,
                "quantity":   p_row.quantity,
                "precio":     float(p_row.unit_price),
                "unit_price": float(p_row.unit_price)
            })

        detalle_completo = {
            "id":              code,
            "code":            code,
            "fecha":           fecha,
            "quotation_date":  fecha,
            "estado":          estado,
            "status":          estado,
            "observaciones":   general_comment,
            "general_comment": general_comment,
            "total":           f"S/. {total_float:.2f}",
            "productos":       lista_productos,
            "cliente": {
                "nombre":   row.nombre_cliente,
                "correo":   row.correo_cliente,
                "telefono": row.telefono_cliente or 'No registrado',
                "empresa":  row.empresa_cliente or ''
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({"data": detalle_completo})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }
    finally:
        if conn: conn.close()