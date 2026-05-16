import importlib.util
import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Gateway Simulado - Módulo Cliente")

# Permite llamadas desde Angular (localhost:4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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