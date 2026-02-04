# MILO Challenge - Sistema de Lockers

## Descripción General

Este proyecto implementa un sistema de gestión de lockers para entregas de domicilios. El sistema incluye una API backend desarrollada en Node.js con Express y PostgreSQL, y un frontend desarrollado en React con TypeScript.

## Inicialización Automática con Docker

Al ejecutar el proyecto con Docker Compose, se ejecuta automáticamente un script de inicialización ubicado en el backend que realiza las siguientes acciones:

1. Crea la estructura completa de la base de datos si no existe
2. Inserta datos de prueba en todas las tablas
3. Inicia el servidor de la API

Este proceso asegura que el sistema esté completamente funcional desde el primer arranque, con datos de ejemplo listos para ser utilizados.

## Datos de Prueba

### Usuarios de Prueba

El script de inicialización crea tres usuarios con diferentes roles:

**Administrador:**
- Nombre: Juan Admin
- Email: juan.admin@example.com
- Contraseña: admin123
- Dirección: Calle 80 #10-20, Bogotá

**Cliente:**
- Nombre: Carlos Cliente
- Email: carlos.cliente@example.com
- Contraseña: cliente123
- Dirección: Carrera 7 #45-30, Bogotá

**Repartidor:**
- Nombre: María Delivery
- Email: maria.delivery@example.com
- Contraseña: delivery123
- Dirección: Avenida 68 #25-15, Bogotá

### Otros Datos de Prueba

Además de los usuarios, el script crea:

- Tres lockers ubicados en diferentes zonas de Bogotá (Centro, Chapinero y Usaquén)
- Estados de órdenes (En preparación, En camino, En el locker, Entregada, Cancelada)
- Una orden de ejemplo con códigos de entrega encriptados
- Esta órden sin embargo es borrada para probar los diferentes endpoints.

## Cómo Ejecutar el Proyecto con Docker

### Requisitos Previos

- Docker instalado en el sistema
- Docker Compose instalado

### Pasos para Ejecutar

1. Navegar al directorio raíz del proyecto

2. Construir y levantar los contenedores:

```
sudo docker compose up --build
```

Para ejecutar en modo desacoplado (background):

```
sudo docker compose up -d --build
```

3. Los servicios estarán disponibles en:
   - API Backend: http://localhost:3000
   - Frontend: http://localhost:3001
   - PostgreSQL: localhost:5433

### Detener los Contenedores

Para detener todos los servicios:

```
sudo docker compose down
```

## Estructura de la Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:

- **roles**: Define los roles de usuario (admin, cliente, delivery)
- **users**: Almacena la información de usuarios del sistema
- **lockers**: Contiene los lockers disponibles con su ubicación
- **order_statuses**: Define los posibles estados de una orden
- **orders**: Registra las órdenes con códigos de entrega encriptados

Todas las tablas se crean automáticamente al iniciar el proyecto por primera vez.

## Notas Importantes

- El puerto 5433 está mapeado para PostgreSQL para evitar conflictos con instancias locales que puedan estar corriendo en el puerto estándar 5432
- Los datos de prueba se insertan solo una vez al inicio
- Las contraseñas están hasheadas con bcrypt por seguridad
- Los códigos de entrega están encriptados en la base de datos

## Documentación Detallada

Cada proyecto incluye su propio README con información detallada sobre la estructura, decisiones de arquitectura y detalles técnicos específicos:

- **Backend**: `backend/README.md` - Documenta la estructura de la API, rutas, middleware, utilidades y decisiones de arquitectura del servidor
- **Frontend**: `frontend/milo-challenge/README.md` - Explica la estructura de componentes, servicios, contextos y decisiones de diseño de la interfaz
