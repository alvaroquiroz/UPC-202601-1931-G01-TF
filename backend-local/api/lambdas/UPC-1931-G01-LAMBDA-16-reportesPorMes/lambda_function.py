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
                YEAR(quotation_date) AS anio,
                MONTH(quotation_date) AS mes,
                COUNT(id) AS total,
                SUM(total) AS monto_total
            FROM quotations
            GROUP BY YEAR(quotation_date), MONTH(quotation_date)
            ORDER BY anio DESC, mes DESC
        """)

        meses = []
        nombres_meses = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

        for row in cursor.fetchall():
            meses.append({
                "anio":        row.anio,
                "mes":         row.mes,
                "mes_nombre":  nombres_meses[row.mes],
                "periodo":     f"{nombres_meses[row.mes]} {row.anio}",
                "total":       row.total,
                "monto_total": float(row.monto_total)
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({"data": meses})
        }
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
    finally:
        if conn: conn.close()