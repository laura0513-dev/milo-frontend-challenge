# RappiClone - MVP Frontend

> Proyecto desarrollado para la entrevista técnica de MILO.io

Sistema de gestión de órdenes y lockers inteligentes inspirado en servicios de entrega como Rappi. Esta aplicación permite a clientes, repartidores y administradores gestionar el ciclo completo de entrega de órdenes a través de lockers automatizados.

---

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura y Stack Tecnológico](#arquitectura-y-stack-tecnológico)
- [Flujo de la Aplicación](#flujo-de-la-aplicación)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## Características Principales

### Roles de Usuario

- **Cliente**: Crear órdenes, buscar lockers cercanos, reclamar paquetes con códigos de verificación
- **Repartidor**: Gestionar entregas, actualizar estado de órdenes, depositar paquetes en lockers
- **Administrador**: Vista completa del sistema, gestión de órdenes, lockers y usuarios

### Funcionalidades Clave

- Autenticación con JWT (JWT Bearer Token)
- Gestión de órdenes con estados (Preparando, En camino, En locker, Entregada, Cancelada)
- Sistema de códigos de verificación con expiración (60 segundos)
- Búsqueda de lockers por geolocalización (latitud/longitud)
- Dashboards personalizados por rol
- Accesibilidad completa con etiquetas ARIA
- Diseño responsive con Material-UI

---

## Arquitectura y Stack Tecnológico

### Stack Principal

- Frontend: React 19.2.4 con TypeScript
- UI Library: Material-UI (MUI) 7.3.7
- Routing: React Router DOM 7.13.0
- State Management: React Context API + Custom Hooks
- Styling: @emotion/react + @emotion/styled
- HTTP Client: Fetch API nativo
- Validation: Zod 4.3.6

### Arquitectura del Frontend

**Arquitectura Modular Basada en Features (Feature-Based Architecture)**

La aplicación está construida siguiendo una arquitectura modular donde cada funcionalidad (feature) es independiente y auto-contenida. Esta decisión arquitectónica se tomó por las siguientes razones:

1. **Escalabilidad**: Cada feature puede crecer de manera independiente sin afectar otras partes del sistema
2. **Mantenibilidad**: Facilita la localización y modificación de código relacionado
3. **Reusabilidad**: Componentes y lógica pueden ser compartidos a través de la carpeta `shared/`
4. **Separación de Responsabilidades**: Cada módulo tiene su propia lógica, componentes, estilos y servicios
5. **Trabajo en Equipo**: Diferentes desarrolladores pueden trabajar en features distintas sin conflictos

#### Estructura de Features

```
src/
├── features/           # Módulos principales de funcionalidad
│   ├── auth/          # Autenticación (Login, AdminLogin, AuthContext)
│   ├── orders/        # Gestión de órdenes
│   │   ├── components/    # Componentes específicos (OrderCard, StatusBadge)
│   │   ├── forms/        # Formularios (NewOrderForm)
│   │   ├── hooks/        # Custom hooks (useDeliveryCodes, useClientCodes)
│   │   ├── Orders.tsx    # Componente principal
│   │   └── orderService.ts  # Lógica de negocio y API calls
│   ├── lockers/       # Gestión de lockers
│   ├── dashboard/     # Dashboards por rol
│   ├── clients/       # Gestión de clientes
│   └── profile/       # Perfil de usuario
├── shared/            # Recursos compartidos
│   ├── components/    # Componentes reutilizables (CustomModal, Layout)
│   ├── hooks/         # Hooks globales (useAsync, useForm)
│   ├── constants/     # Constantes (routes, enums)
│   └── types.ts       # Tipos TypeScript globales
└── routes/            # Configuración de rutas
```

---

## Flujo de la Aplicación

### 1. Autenticación y Autorización

```
┌─────────────┐
│   Login     │
│  /login     │
└──────┬──────┘
       │
       ├─ Cliente → /login (email + password + role)
       ├─ Repartidor → /login (email + password + role)
       └─ Admin → /admin-login (username + password)
       │
       ▼
┌──────────────────┐
│  authService.ts  │
│  POST /auth/login│
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│ JWT Token Recibido      │
│ Almacenado en localStorage│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ AuthContext Provider     │
│ - user: User | null     │
│ - token: string         │
│ - isAuthenticated: bool │
└───────────┬─────────────┘
            │
            ▼
┌────────────────────────┐
│  Dashboard por Rol     │
│  /dashboard            │
└────────────────────────┘
```

### 2. Flujo de Órdenes (Cliente)

```
Cliente → Nueva Orden
    ↓
1. Ingresa Latitud/Longitud
    ↓
2. Busca Lockers Cercanos
   GET /lockers/nearby?lat=X&lng=Y
    ↓
3. Selecciona Locker
    ↓
4. Crea Orden
   POST /orders (+ JWT Header)
    ↓
5. Orden en Estado "Preparando"
    ↓
6. Repartidor cambia a "En Camino"
    ↓
7. Repartidor deposita → "En Locker"
   (Se genera código de 6 dígitos, expira en 60s)
    ↓
8. Cliente ingresa código → "Entregada"
   PUT /orders/:id/claim
```

### 3. Flujo de Códigos de Verificación

```
Orden en estado "IN_LOCKER"
         │
         ├─ useClientCodes (Cliente)
         │    ↓
         │  GET /orders/:id/client-code
         │    ↓
         │  { code: "123456", expiresIn: 60 }
         │    ↓
         │  Countdown Timer (cada 1s)
         │    ↓
         │  Si expira → Re-fetch automático
         │
         └─ useDeliveryCodes (Repartidor)
              ↓
            GET /orders/:id/delivery-code
              ↓
            { code: "654321", expiresIn: 60 }
              ↓
            Muestra código al repartidor para depositar
```

---

## Decisiones Técnicas

### 1. Arquitectura: Feature-Based Modular

**¿Por qué?**

- **Escalabilidad**: Fácil agregar nuevas features sin afectar las existentes
- **Mantenimiento**: Código relacionado está junto (componentes, hooks, estilos, servicios)
- **Testabilidad**: Cada feature puede ser testeada de forma aislada
- **Reutilización**: Carpeta `shared/` para componentes y hooks globales
- **Organización**: Estructura clara y predecible

**Ejemplo de Feature: `/orders`**

```
orders/
├── components/       # UI específica
│   ├── OrderCard.tsx
│   ├── StatusBadge.tsx
│   └── EmptyOrdersState.tsx
├── forms/           # Formularios
│   └── NewOrderForm.tsx
├── hooks/           # Lógica reutilizable
│   ├── useDeliveryCodes.ts
│   ├── useClientCodes.ts
│   └── useOrderHighlight.ts
├── Orders.tsx       # Componente principal
├── Orders.styles.ts # Estilos
└── orderService.ts  # API calls
```

---

### 2. Librería de Estilos: Material-UI (MUI)

**¿Por qué Material-UI?**

- **Componentes Listos**: Biblioteca completa de componentes UI profesionales
- **Accesibilidad Integrada**: Componentes con ARIA labels por defecto
- **Theming Potente**: Sistema de temas con `sx` prop y `@emotion/styled`
- **TypeScript First**: Tipado completo y autocompletado
- **Responsive por Defecto**: Grid system y breakpoints integrados
- **Iconografía**: `@mui/icons-material` con 2000+ iconos
- **Mantenimiento Activo**: Comunidad grande y actualizaciones frecuentes

**Sistema de Estilos Utilizado**

Se implementan tres aproximaciones complementarias:

1. **Emotion (Styled Components)**: Definición de estilos en archivos `.styles.ts` separados con objetos reutilizables
2. **SX Prop (Inline Styling)**: Para estilos dinámicos basados en estado o props del componente
3. **Theme Provider**: Acceso al tema global para mantener consistencia visual en toda la aplicación

**Ventajas de esta Aproximación**:

- Estilos colocados sin CSS global
- Estilos dinámicos basados en props y estado
- Code splitting automático
- IntelliSense completo para propiedades de estilo

---

### 3. Hooks, Context API y Custom Hooks

#### React Context API

**¿Por qué Context en lugar de Redux/Zustand?**

- **Simplicidad**: Para un MVP, Context API es suficiente
- **Sin Dependencias Extra**: Integrado en React
- **Performance Adecuada**: Con memoización es eficiente
- **TypeScript Friendly**: Tipado completo

**Contextos Implementados**:

**AuthContext** (`features/auth/AuthContext.tsx`)

- **Propósito**: Gestión global de autenticación
- **Almacena**: Usuario actual, JWT token, estado de autenticación
- **Persiste**: Token en `localStorage` para sesiones persistentes
- **Proporciona**: Funciones de login, logout y estado de autenticación

#### Custom Hooks

**¿Por qué Custom Hooks?**

- **Reutilización de Lógica**: Compartir comportamiento entre componentes
- **Separación de Responsabilidades**: UI vs lógica de negocio
- **Testabilidad**: Hooks pueden ser testeados independientemente
- **Legibilidad**: Componentes más limpios y enfocados en UI

**Custom Hooks Implementados**:

1. **`useDeliveryCodes`** (`features/orders/hooks/`)
   - **Propósito**: Gestionar códigos de locker para repartidores
   - **Funcionalidad**: Fetch código cada 60 segundos, countdown timer actualizado cada 1s, auto-refresh cuando expira

2. **`useClientCodes`** (`features/orders/hooks/`)
   - **Propósito**: Gestionar códigos de recogida para clientes
   - **Funcionalidad**: Similar a `useDeliveryCodes` pero para clientes

3. **`useOrderHighlight`** (`features/orders/hooks/`)
   - **Propósito**: Scroll automático a orden destacada desde dashboard
   - **Funcionalidad**: Scroll suave y eliminación del query param después de 1.5s

4. **`useAsync`** (`shared/hooks/`)
   - **Propósito**: Manejar estados de operaciones asíncronas (idle, pending, success, error)

5. **`useForm`** (`shared/hooks/`)
   - **Propósito**: Gestión de formularios con validación

6. **`useCurrentUser`** (`shared/hooks/`)
   - **Propósito**: Acceso rápido a información del usuario autenticado

**Beneficios de esta Arquitectura de Hooks**:

```
┌───────────────────────────────────────────┐
│          Componente UI (Orders.tsx)       │
│  - Renderiza UI                           │
│  - Maneja eventos de usuario              │
└───────────────┬───────────────────────────┘
                │
                ├─ useDeliveryCodes() → Códigos de repartidor
                ├─ useClientCodes() → Códigos de cliente
                ├─ useOrderHighlight() → Scroll a orden
                └─ useAuth() → Usuario actual
                
= Componente limpio, enfocado en UI
= Lógica reutilizable en múltiples componentes
= Fácil de testear independientemente
```

---

### 4. Accesibilidad (ARIA Labels y Atributos)

**Implementación Completa de Accesibilidad**

La aplicación implementa estándares WCAG 2.1 AA para garantizar accesibilidad a usuarios con discapacidades.

#### ¿Dónde se Aplica Accesibilidad?

1. **Formularios** (atributos `aria-label`, `aria-required`, `aria-invalid`)
   - **Ubicaciones**: Login.tsx, AdminLogin.tsx, NewOrderForm.tsx, NewLockerForm.tsx, Profile.tsx
   - Todos los campos de entrada tienen etiquetas descriptivas para lectores de pantalla

2. **Botones Interactivos** (atributos `aria-label` descriptivos)
   - **Ubicaciones**: Todos los componentes con botones de acción
   - Botones de iconos incluyen descripciones claras de su funcionalidad

3. **Modales y Diálogos** (atributos `aria-labelledby`, `aria-describedby`)
   - **Ubicaciones**: CustomModal.tsx, CodeVerificationModal.tsx
   - Estructura semántica correcta con títulos y descripciones identificables

4. **Menús Desplegables** (atributos `aria-haspopup`, `aria-expanded`, `aria-controls`)
   - **Ubicaciones**: ActionMenu.tsx, OrderCard.tsx
   - Estados de menú comunicados apropiadamente

5. **Campos de Solo Lectura** (atributo `aria-readonly`)
   - **Ubicaciones**: Profile.tsx
   - Campos no editables claramente identificados

#### Beneficios de Accesibilidad

- **Lectores de Pantalla**: NVDA, JAWS, VoiceOver pueden navegar la app completamente
- **Navegación por Teclado**: Tab, Enter, Espacio funcionan correctamente en todos los elementos interactivos
- **Semántica HTML**: Roles y etiquetas correctas para estructura clara
- **Estados de Error**: Comunicados apropiadamente con `aria-invalid`
- **Campos Requeridos**: Marcados explícitamente con `aria-required`

---

### 5. Gestión de Peticiones HTTP y JWT

#### Arquitectura de Servicios

**¿Por qué Fetch API en lugar de Axios?**

- **Nativo del Navegador**: No requiere dependencias extra
- **Promise-Based**: Compatible con async/await
- **TypeScript Friendly**: Tipado completo
- **Suficiente para MVP**: Funcionalidad adecuada

**Estructura de Servicios**:

```
features/
├── auth/
│   └── authService.ts       # Login, logout
├── orders/
│   └── orderService.ts      # CRUD de órdenes, códigos
├── lockers/
│   └── lockerService.ts     # CRUD de lockers, búsqueda cercana
└── clients/
    └── clientService.ts     # Gestión de clientes
```

#### Patrón de Servicio (Service Layer)

Cada servicio encapsula la lógica de comunicación con el backend. Todos los métodos de servicio reciben el token JWT como parámetro y lo incluyen en el header Authorization. Los servicios manejan las respuestas HTTP, conversión a JSON, y propagación de errores a los componentes.

**Funciones principales de los servicios**:

- Obtener recursos (GET)
- Crear recursos (POST)
- Actualizar recursos (PUT/PATCH)
- Eliminar recursos (DELETE)
- Obtención de códigos de verificación con expiración

