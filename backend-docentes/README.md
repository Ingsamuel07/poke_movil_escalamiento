# Microservicio agnóstico de docentes UNINPAHU

Microservicio implementado con el módulo HTTP nativo de **Node.js**, sin frameworks web como Express, NestJS, Koa o Fastify.

Se conecta a una base de datos relacional **MySQL o PostgreSQL** y recibe los datos de entrada mediante **Path Params** o **Query Params** (nunca mediante parámetros en el body). La API está documentada con **Swagger OpenAPI 3.0**.

---

## 🌟 Características Principales

1. **Agnóstico y Ligero**: Sin dependencias de frameworks web. Utiliza únicamente el servidor HTTP estándar de Node.js.
2. **Base de Datos Relacional (MySQL / PostgreSQL)**:
   - Tabla: `docentes`.
   - En el primer arranque crea la tabla y carga los datos iniciales si está vacía.
   - En el arranque elimina las columnas `telefono`, `sede`, `resumen`, `areas_investigacion` y `asignaturas` si aún existen. Los datos almacenados en esas columnas se eliminan.
   - Las consultas y cambios se realizan directamente en la base de datos configurada.
3. **Parámetros por Ruta (Path Params)**:
   - `GET /api/docentes/:id` (ej. `/api/docentes/1`).
   - `PUT /api/docentes/:id?campo=valor` para actualizar los campos indicados.
   - `DELETE /api/docentes/:id` para eliminar un docente.
4. **Parámetros de Consulta (Query Params)**:
   - `GET /api/docentes?search=...&programa=...`
   - `GET /api/docentes/buscar?q=morantes`
   - `POST /api/docentes/agregar?nombre=...&cargo=...` (sin body)
   - La actualización usa Query Params en la ruta `PUT /api/docentes/:id?...` (sin body).
   - `POST /api/docentes/seed` (sin body)
5. **Documentación Swagger Integrada**:
   - Interfaz Swagger UI interactiva servida en `/api-docs`.
   - Especificación OpenAPI 3.0 JSON servida en `/swagger.json`.
6. **Manejo de CORS Nativo**: Admite peticiones desde aplicaciones móviles (Expo / React Native) y navegadores web.

---

## 🚀 Ejecución Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno (`.env`)
Para desarrollo se puede usar MySQL/PostgreSQL local. En producción, configura `DATABASE_URL` con la cadena de conexión de una base de datos relacional en la nube (por ejemplo Neon PostgreSQL, Supabase o Railway):
```env
PORT=4000
DATABASE_URL=postgresql://usuario:password@host/base_de_datos?sslmode=require
```
También se admiten `MYSQL_URL` y `POSTGRES_URL`. El servicio no inicia si la base de datos no está configurada o no responde; no usa almacenamiento en memoria.

### 3. Iniciar el microservicio
```bash
npm start
```
- Servidor disponible en: `http://localhost:4000`
- Documentación Swagger UI: `http://localhost:4000/api-docs`
- JSON OpenAPI: `http://localhost:4000/swagger.json`
- Verificación de estado: `http://localhost:4000/health`

---

## 📋 Endpoints de la API

| Método | Endpoint | Tipo de Parámetro | Descripción |
|---|---|---|---|
| `GET` | `/api/docentes` | Query Params (`?search=...&programa=...`) | Lista los docentes registrados en la base relacional con filtros opcionales. |
| `GET` | `/api/docentes/:id` | Path Param (`/:id`) | Obtiene los detalles completos de un docente por su ID numérico. |
| `GET` | `/api/docentes/buscar` | Query Param (`?q=...`) | Búsqueda por coincidencia en texto libre. |
| `POST` | `/api/docentes/agregar?nombre=...&cargo=...` | Query Params; sin body | Registra un docente. Nombre y cargo son obligatorios; los demás campos son opcionales y vacíos quedan como `NULL`. No se asigna imagen automática. |
| `PUT` | `/api/docentes/:id?nombre=...&cargo=...` | Path y Query Params; sin body | Actualiza únicamente los campos enviados del docente. |
| `DELETE` | `/api/docentes/:id` | Path Param; sin body | Elimina el docente indicado. |
| `POST` | `/api/docentes/seed` | Sin body | Sincroniza los docentes iniciales de la Facultad FITI UNINPAHU. |
| `GET` | `/health` | N/A | Reporta el estado del motor de base de datos relacional. |
| `GET` | `/api-docs` | N/A | Interfaz Swagger UI interactiva. |
| `GET` | `/swagger.json` | N/A | Esquema OpenAPI 3.0. |

---

## ☁️ Despliegue en la Nube (Render.com / Railway)

El servicio está declarado en el `render.yaml` de la raíz del repositorio. Al desplegarlo en Render:
```yaml
  - type: web
    name: docentes-backend-nodejs
    env: node
    rootDir: backend-docentes
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        sync: false
```
En el panel de Render agrega `DATABASE_URL` como variable secreta y asígnale la URL de PostgreSQL/MySQL en la nube. La documentación estará disponible en `https://<servicio>.onrender.com/api-docs` y el estado en `/health`.
