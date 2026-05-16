# Entorno Local del Backend (FastAPI + SQL Server)

Para que el frontend de Angular funcione y muestre datos reales, necesitamos tener la base de datos y la API encendidas. Hemos configurado Docker para que simule nuestro entorno AWS y evitar bloqueos en la cuenta

## Requisitos Previos

1. **Instalar Docker Desktop para Windows:**
   Si aún no tienes Docker instalado, descárgalo desde la página oficial e instálalo:
    [Descargar Docker Desktop para Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Abre Docker Desktop y asegúrate de que esté corriendo en segundo plano

---

## SOBRE LAS FUNCIONES LAMBDA!

Dentro de la carpeta `api/lambdas/` encontrarán el código fuente de nuestras funciones (`lambda_function.py`). 

El archivo `main.py` (FastAPI) simula el **AWS API Gateway**; cuando llegue el momento del despliegue, **estas carpetas se exportarán a AWS Lambda tal cual y sin cambios.**

---

## Paso a paso para levantar el proyecto local

**Paso 1:** Abre una terminal en tu editor de código y navega hasta esta carpeta (`backend-local`).
```bash
cd backend-local
```

**Paso 2:** Ejecuta el comando mágico de Docker para construir y encender los contenedores:
```bash
docker-compose up -d --build
```

(La primera vez puede tardar unos minutos porque descargará la imagen de SQL Server y Python).

**Paso 3:** Abrir otra terminal, ir a la carpeta principal de Angular y ejecutar ng serve.

## Cómo apagar el backend?
Cuando termines de trabajar y quieras apagar el servidor para liberar memoria RAM en tu PC, ejecuta en esta misma carpeta:
```bash
docker-compose down
```



