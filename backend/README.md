# RappiClone - MVP Backend

## Descripción General

RappiClone es un sistema de gestión de entregas y lockers inteligentes desarrollado como MVP (Producto Mínimo Viable) para una entrevista técnica en MILO.io. El proyecto implementa un backend completo que gestiona órdenes, asignación de repartidores, códigos OTP de seguridad, y búsqueda inteligente de lockers cercanos mediante cálculos geoespaciales.

---

## Arquitectura

### Patrón: REST API con Node.js/Express

#### Decisión Arquitectónica

Se eligió una arquitectura REST sobre Express.js por las siguientes razones:

**Simplicidad y Productividad**: Para un MVP, la arquitectura REST permite desarrollar e iterar rápidamente sin la complejidad de GraphQL o arquitecturas más avanzadas.

**Escalabilidad Horizontal**: Express es stateless, permitiendo múltiples instancias detrás de un balanceador de carga.

**Compatibilidad con Estándares**: REST es el estándar de facto para aplicaciones móviles y web, facilitando la integración con diferentes clientes (iOS, Android, web).

**Ecosistema Maduro**: Node.js y Express tienen miles de librerías probadas en producción para resolver problemas comunes.

### Capas de la Aplicación

La aplicación sigue una estructura de tres capas:

**Capa de Rutas (Routes)**: Ubicada en `src/routes/`, define los endpoints HTTP y coordina el flujo de solicitudes.

**Capa de Consultas (Queries)**: Ubicada en `src/utils/query/`, contiene todas las consultas SQL parametrizadas para evitar inyección SQL.

**Capa de Middleware**: Ubicada en `src/middleware/`, implementa autenticación, autorización y validación de solicitudes.

---

## Decisiones de Peticiones al Servicio

### Sistema de Autenticación JWT

#### Flujo de Autenticación

El sistema utiliza tokens JWT (JSON Web Tokens) para mantener sesiones sin estado. Cada usuario recibe un token al autenticarse que debe incluirse en el encabezado Authorization de todas las solicitudes posteriores.

#### Middleware de Autorización por Rol

Se implementaron cuatro tipos de middleware de autorización:

**authAdmin**: Solo usuarios con rol administrador pueden acceder.

**authCliente**: Solo usuarios con rol cliente pueden acceder.

**authDelivery**: Solo usuarios con rol repartidor pueden acceder.

**authAny**: Cualquier usuario autenticado puede acceder (verificación de token pero no de rol).

#### Justificación

Este enfoque garantiza que cada usuario solo accede a recursos para los cuales tiene permisos, proporcionando seguridad en las capas de aplicación sin depender únicamente de la base de datos.

### Manejo de Errores y Estados HTTP

Se utilizan códigos HTTP estándar:

**200 OK**: Operación exitosa.

**201 Created**: Recurso creado exitosamente.

**400 Bad Request**: Validación fallida o parámetros inválidos.

**403 Forbidden**: Usuario no autorizado para la acción.

**404 Not Found**: Recurso no encontrado.

**500 Internal Server Error**: Error del servidor.

Cada respuesta de error incluye un mensaje descriptivo que permite al cliente identificar el problema específico.

---

## Enrutamiento y Patrones de Diseño

### Estructura de Rutas

Las rutas están organizadas por entidad en archivos separados:

**src/routes/auth.js**: Autenticación y gestión de usuarios.

**src/routes/orders.js**: Gestión completa de órdenes.

**src/routes/lockers.js**: Búsqueda y gestión de lockers.

**src/routes/users.js**: Administración de usuarios (solo admin).

### Patrón de Repositorio para Consultas SQL

Se implementó el patrón de repositorio mediante la separación de consultas SQL en `src/utils/query/`. Cada archivo contiene las consultas SQL parametrizadas para una entidad específica:

**src/utils/query/orders.js**: Consultas relacionadas con órdenes.

**src/utils/query/lockers.js**: Consultas relacionadas con lockers.

**src/utils/query/users.js**: Consultas relacionadas con usuarios.

#### Beneficios

**Reutilización**: Las consultas se pueden usar desde múltiples rutas sin duplicación.

**Mantenibilidad**: Cambios en la estructura de base de datos se hacen en un único lugar.

**Prevención de Inyección SQL**: Se utilizan consultas parametrizadas exclusivamente.

**Claridad**: Las consultas SQL están separadas de la lógica de negocio.

### Patrón de Encriptación para Códigos de Seguridad

Los códigos OTP (6 dígitos) se encriptan usando AES-256-CBC antes de almacenarse en la base de datos:

**src/utils/encryption.js**: Contiene funciones para generar, encriptar, desencriptar y validar códigos.

#### Por Qué Encriptación

Los códigos OTP son sensibles y no deben estar en texto plano en la base de datos. Aunque la base de datos está en una red privada, este es un control de seguridad en profundidad.

### Patrón de Constantes Centralizadas

Se implementó un sistema de constantes centralizado en `src/utils/constants.js`:

Los estados de órdenes se definen en un único lugar como mapeo entre constantes en inglés y nombres descriptivos en español.

#### Ventaja

El frontend puede solicitar las constantes válidas mediante un endpoint, garantizando sincronización entre cliente y servidor sin cambios manuales.

---

## Estructura de Entidades

### Modelo de Datos Relacional

La aplicación utiliza PostgreSQL con las siguientes entidades principales:

### Tabla: Users

Almacena información de todos los usuarios del sistema.

Campos: id, name, email, password, role_id, created_at, updated_at.

Relación: Cada usuario tiene exactamente un rol.

### Tabla: Roles

Define los tipos de usuarios del sistema: administrador, cliente, repartidor.

Campos: id, name.

### Tabla: Orders

Representa órdenes de entrega de paquetes.

Campos: id, user_id (cliente propietario), delivery_user_id (repartidor asignado), locker_id (destino), status_id, client_code_encrypted, delivery_code_encrypted, created_at, updated_at.

Relaciones: Múltiples claves foráneas hacia users, lockers, order_statuses.

Justificación de Diseño: Los códigos OTP se almacenan encriptados con campos separados para el vector de inicialización y marca de tiempo de generación, permitiendo validación de expiración sin desencriptar.

### Tabla: Order_Statuses

Define los estados posibles de una orden.

Estados: En preparación, En camino, En el locker, Entregada, Cancelada.

Justificación: Usar una tabla separada permite cambiar estados sin migrar la base de datos, y proporciona una fuente única de verdad para los estados válidos.

### Tabla: Lockers

Almacena información de puntos de entrega.

Campos: id, name, address, latitude, longitude, is_active, created_at, updated_at.

Justificación: Las coordenadas geográficas se utilizan con la fórmula del Haversine para calcular distancias y encontrar lockers cercanos. Cada locker tiene un estado activo/inactivo para permitir mantenimiento sin eliminar registros.

### Relaciones y Restricciones

**Cascada de Eliminación**: No implementada por diseño. Los usuarios no se eliminan sino que se desactivan, preservando historial de órdenes.

**Índices**: Se crean índices en claves foráneas y en campos frecuentemente consultados (user_id, delivery_user_id, status_id) para optimizar performance.

---

## Funcionalidades Principales

### Gestión de Órdenes

Las órdenes atraviesan un ciclo de vida definido:

**En preparación**: Estado inicial cuando se crea la orden. El backend asigna automáticamente este estado sin requerer entrada del usuario.

**En camino**: El repartidor asignado obtiene un código OTP (6 dígitos) que valida el cambio de estado.

**En el locker**: El repartidor valida el código de entrega y el sistema genera automáticamente un código para el cliente.

**Entregada**: El cliente ingresa su código OTP en la aplicación y el sistema cambia automáticamente el estado.

**Cancelada**: Estado final para órdenes que no se completaron.

### Sistema de Códigos OTP

Existen dos tipos de códigos con propósitos diferentes:

**Código de Delivery**: Generado cuando se cambia a "En camino". El repartidor lo obtiene del endpoint y lo usa para confirmar cambio a "En el locker".

**Código de Cliente**: Generado automáticamente cuando el repartidor confirma "En el locker". El cliente lo usa para completar la entrega.

Ambos códigos expiran después de 60 segundos para garantizar seguridad.

### Búsqueda de Lockers Cercanos

Utiliza la fórmula del Haversine para calcular distancias geodésicas entre coordenadas del usuario y lockers disponibles. Radio de búsqueda fijo en 5 kilómetros. Retorna lockers ordenados por distancia.

---

## Decisiones de Seguridad

### Autenticación Sin Sesiones

Se implementó JWT sin sesiones del lado del servidor. El token contiene toda la información necesaria (id usuario, email, rol) y se valida criptográficamente en cada solicitud.

Beneficio: Escalabilidad horizontal sin necesidad de sincronizar sesiones entre servidores.

### Contraseñas Hasheadas

Las contraseñas se hashean con bcrypt antes de almacenarse. Nunca se almacenan en texto plano.

### Validación de Solicitudes en Múltiples Capas

Se valida que el usuario que realiza una acción sea el propietario del recurso (para clientes) o tenga permisos suficientes (para admins). Esto se hace en la ruta, no solo en la base de datos.

### Encriptación de Códigos Sensibles

Los códigos OTP se encriptan antes de almacenarse, con vector de inicialización único para cada código.

---

## Instalación Local (Sin Docker)

Requisitos: Node.js v18+, PostgreSQL v12+.

Pasos:

1. Clonar repositorio
2. Instalar dependencias: npm install
3. Configurar variables de entorno en archivo .env
4. Ejecutar migraciones de base de datos
5. Iniciar servidor: npm start

---

## Endpoints Principales

La API está completamente documentada en los archivos de guía anteriores. Los principales grupos de endpoints son:

**Autenticación**: POST /api/auth/login, POST /api/auth/register.

**Órdenes**: GET /api/orders, POST /api/orders, PUT /api/orders/:id/status, POST /api/orders/:id/confirm-pickup.

**Lockers**: GET /api/lockers/nearby/:lat/:lng, GET /api/lockers.

**Usuarios**: GET /api/users (admin only).

**Configuración**: GET /api/orders/config/statuses (retorna constantes de estados).

---

## Licencia

Proyecto de prueba técnica. No tiene licencia de distribución.
