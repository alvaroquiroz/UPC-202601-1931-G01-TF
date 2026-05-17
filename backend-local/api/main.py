import importlib.util
import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="API Gateway Simulado - Módulo Cliente")

# Permite llamadas desde Angular (localhost:4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VendedorActionBody(BaseModel):
    user_id: int
    comment: Optional[str] = None

def invocar_lambda(nombre_carpeta: str, event: dict):
    ruta_script = os.path.join(os.path.dirname(__file__), "lambdas", nombre_carpeta, "lambda_function.py")
    spec = importlib.util.spec_from_file_location("lambda_module", ruta_script)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    respuesta = modulo.lambda_handler(event, {})
    return json.loads(respuesta['body'])

@app.get("/api/v1/productos")
async def listar_productos(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-04-listarProductos", event)

@app.get("/api/v1/cotizaciones")
async def listar_cotizaciones(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-05-listarCotizaciones", event)

@app.get("/api/v1/cotizaciones/{id}")
async def obtener_detalle_cotizacion(id: str, request: Request):
    event = {"httpMethod": "GET", "pathParameters": {"id": id}}
    return invocar_lambda("UPC-1931-G01-LAMBDA-06-obtenerDetalleCotizacion", event)

@app.post("/api/v1/cotizaciones")
async def crear_cotizacion(request: Request):
    body_bytes = await request.body()
    event = {"httpMethod": "POST", "body": body_bytes.decode('utf-8')}
    return invocar_lambda("UPC-1931-G01-LAMBDA-07-crearCotizacion", event)

@app.get("/api/v1/vendedor/cotizaciones")
async def listar_cotizaciones_vendedor(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-08-listarCotizacionesVendedor", event)

@app.get("/api/v1/vendedor/cotizaciones/{id}")
async def obtener_detalle_cotizacion_vendedor(id: str, request: Request):
    event = {"httpMethod": "GET", "pathParameters": {"id": id}}
    return invocar_lambda("UPC-1931-G01-LAMBDA-09-obtenerDetalleCotizacionVendedor", event)

@app.put("/api/v1/vendedor/cotizaciones/{id}/aprobar")
async def aprobar_cotizacion(id: str, body: VendedorActionBody):
    event = {
        "httpMethod": "PUT",
        "pathParameters": {"id": id},
        "body": body.model_dump_json()
    }
    return invocar_lambda("UPC-1931-G01-LAMBDA-10-aprobarCotizacion", event)

@app.put("/api/v1/vendedor/cotizaciones/{id}/observar")
async def observar_cotizacion(id: str, body: VendedorActionBody):
    event = {
        "httpMethod": "PUT",
        "pathParameters": {"id": id},
        "body": body.model_dump_json()
    }
    return invocar_lambda("UPC-1931-G01-LAMBDA-11-observarCotizacion", event)

@app.put("/api/v1/vendedor/cotizaciones/{id}/rechazar")
async def rechazar_cotizacion(id: str, body: VendedorActionBody):
    event = {
        "httpMethod": "PUT",
        "pathParameters": {"id": id},
        "body": body.model_dump_json()
    }
    return invocar_lambda("UPC-1931-G01-LAMBDA-12-rechazarCotizacion", event)

@app.get("/api/v1/vendedor/cotizaciones/{id}/historial")
async def historial_cotizacion(id: str, request: Request):
    event = {"httpMethod": "GET", "pathParameters": {"id": id}}
    return invocar_lambda("UPC-1931-G01-LAMBDA-13-historialCotizacion", event)

@app.get("/api/v1/admin/usuarios")
async def listar_usuarios(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-14-listarUsuarios", event)

@app.get("/api/v1/admin/reportes/estados")
async def reportes_por_estado(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-15-reportesPorEstado", event)

@app.get("/api/v1/admin/reportes/meses")
async def reportes_por_mes(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-16-reportesPorMes", event)

@app.get("/api/v1/admin/reportes/clientes")
async def ranking_clientes(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-17-rankingClientes", event)

@app.get("/api/v1/admin/reportes/vendedores")
async def reportes_por_vendedor(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-18-reportesPorVendedor", event)

@app.get("/api/v1/admin/cotizaciones")
async def listar_cotizaciones_admin(request: Request):
    event = {"httpMethod": "GET", "queryStringParameters": dict(request.query_params)}
    return invocar_lambda("UPC-1931-G01-LAMBDA-19-listarCotizacionesAdmin", event)