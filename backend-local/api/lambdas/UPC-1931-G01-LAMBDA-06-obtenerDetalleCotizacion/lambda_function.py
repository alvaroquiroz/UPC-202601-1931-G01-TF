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
        print("\n=== [DEBUG] LAMBDA 06 EJECUTÁNDOSE ===")
        path_params = event.get('pathParameters') or {}
        qs_params = event.get('queryStringParameters') or {}
        
        cot_id = path_params.get('id') or qs_params.get('id') or event.get('id')
        if not cot_id and event.get('path'):
            cot_id = event['path'].split('/')[-1]

        print(f"-> ID Capturado por la Lambda: {cot_id}")
            
        conn = get_db_connection()
        cursor = conn.cursor()
        row = None
        
        try:
            query_code = """
            SELECT c.id, c.code, c.quotation_date, c.total, s.name as estado
            FROM quotations c
            JOIN quotation_statuses s ON c.status_id = s.id
            WHERE c.code = ?
            """
            cursor.execute(query_code, (str(cot_id),))
            row = cursor.fetchone()
        except Exception as e:
            print(f"[ERROR SQL CODE]: {str(e)}")
            
        if not row and str(cot_id).isdigit():
            try:
                query_id = """
                SELECT c.id, c.code, c.quotation_date, c.total, s.name as estado
                FROM quotations c
                JOIN quotation_statuses s ON c.status_id = s.id
                WHERE c.id = ?
                """
                cursor.execute(query_id, (int(cot_id),))
                row = cursor.fetchone()
            except Exception as e:
                print(f"[ERROR SQL ID]: {str(e)}")

        if not row:
            print(f"-> Advertencia: No se encontró la cotización {cot_id} en SQL Server.")
            return {
                'statusCode': 404,
                'body': json.dumps({"error": f"Cotizacion {cot_id} no encontrada"})
            }
            
        print(f"-> Éxito: Registro encontrado en Base de Datos. Code: {row.code}, Total: {row.total}")
        db_id = row.id
        code = row.code
        estado = row.estado
        total_float = float(row.total) if row.total else 0.0
        
        if row.quotation_date and hasattr(row.quotation_date, 'strftime'):
            fecha = row.quotation_date.strftime('%Y-%m-%d')
        else:
            fecha = str(row.quotation_date) if row.quotation_date else '2026-05-16'
        
        lista_productos = []
        try:
            query_items_en = """
            SELECT p.name, i.quantity, i.unit_price
            FROM quotation_items i
            JOIN products p ON i.product_id = p.id
            WHERE i.quotation_id = ?
            """
            cursor.execute(query_items_en, (db_id,))
            for p_row in cursor.fetchall():
                lista_productos.append({
                    "nombre": p_row.name,
                    "producto": p_row.name,
                    "cantidad": p_row.quantity,
                    "quantity": p_row.quantity,
                    "precio": float(p_row.unit_price),
                    "unit_price": float(p_row.unit_price)
                })
            print(f"-> Ítems del detalle recuperados: {len(lista_productos)} productos.")
        except Exception as err:
            print(f"[ERROR ÍTEMS]: {str(err)}")
            
        detalle_completo = {
            "id": code,
            "code": code,
            "fecha": fecha,
            "quotation_date": fecha,
            "estado": estado,
            "status": estado,
            "observaciones": "Entrega urgente, coordinar detalles con el cliente.",
            "general_comment": "Entrega urgente, coordinar detalles con el cliente.",
            "total": f"S/. {total_float:.2f}",
            "productos": lista_productos,
            "cliente": {
                "nombre": "Juan Pérez",
                "correo": "cliente@ejemplo.com",
                "telefono": "+51 978452163",
                "empresa": "Tech SAC"
            },
            "vendedor": {
                "nombre": "Carlos Vendedor",
                "correo": "carlos@empresa.com"
            }
        }
        
        print("=== [DEBUG] ENVIANDO RESPONSE PROXY EXITOSO ===\n")
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({"data": detalle_completo})
        }

    except Exception as e:
        print(f"[CRITICAL ERR]: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }
    finally:
        if conn: conn.close()