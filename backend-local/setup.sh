#!/bin/bash

# 1. Iniciamos el motor de SQL Server en segundo plano
/opt/mssql/bin/sqlservr &

# 2. Le damos tiempo al motor para que encienda completamente
echo "Esperando 20 segundos a que SQL Server inicie..."
sleep 20s

# 3. Ejecutamos el archivo init.sql automáticamente
echo "Ejecutando script de inicialización (init.sql)..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "$MSSQL_SA_PASSWORD" -C -i /init.sql

echo "¡Base de datos creada y datos inyectados exitosamente!"

# 4. Traemos el proceso de SQL Server de vuelta al frente para que el contenedor no se apague
wait