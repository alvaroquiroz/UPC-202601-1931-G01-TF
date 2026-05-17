FROM mcr.microsoft.com/mssql/server:2022-latest

# Cambiamos temporalmente a root para configurar permisos y limpiar archivos
USER root

# Copiamos el script de arranque y la data de inicialización al contenedor
COPY init.sql /init.sql
COPY setup.sh /setup.sh

# CORRECCIÓN PARA WINDOWS: Convertimos saltos de línea CRLF a LF 
# y otorgamos permisos de ejecución al script
RUN sed -i 's/\r$//' /setup.sh && \
    sed -i 's/\r$//' /init.sql && \
    chmod +x /setup.sh

# Volvemos al usuario seguro de SQL Server por buenas prácticas
USER mssql

# Reemplazamos el arranque por defecto con tu script automatizado
ENTRYPOINT ["/bin/bash", "/setup.sh"]