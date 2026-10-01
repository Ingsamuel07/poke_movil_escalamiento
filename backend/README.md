# ⚡ Microservicio Pokémon (Node.js & Base de Datos Relacional)

Microservicio REST desarrollado en **Node.js (Express)** conectado a una **base de datos relacional en la nube** (PostgreSQL o MySQL como Supabase, Neon, Render o Railway) para gestionar y consultar 10 Pokémon.

---

## 🚀 Características
- **Base de Datos Relacional**: Soporta conexión nativa con PostgreSQL (`pg`) y MySQL (`mysql2`). Conexión mediante `DATABASE_URL` (SSL habilitado) o variables individuales.
- **Auto-migración y Auto-seed**: Al arrancar, si la tabla `pokemon` no existe o está vacía, crea la estructura e inserta automáticamente los 10 Pokémon oficiales.
- **Documentación Interactiva con Swagger UI**: Disponible en `/api-docs` bajo el estándar OpenAPI 3.0.
- **Listo para Render / Railway**: Incluye `render.yaml`, `Dockerfile` y scripts optimizados.

---

## 📚 Endpoints y Swagger

Accede a la documentación interactiva en:
```
http://localhost:3000/api-docs
```
O en producción:
```
https://tu-servicio-node.onrender.com/api-docs
```

### Rutas principales:
- `GET /api/pokemon`: Lista los 10 Pokémon de la base de datos relacional (soporta `?search=`).
- `GET /api/pokemon/:nombre`: Busca un Pokémon por nombre (ej. `pikachu`) o ID numérico (ej. `25`).
- `POST /api/pokemon`: Inserta o actualiza un Pokémon.
- `POST /api/pokemon/seed`: Re-siembra los 10 Pokémon en la base de datos relacional.
- `GET /health`: Healthcheck para plataformas en la nube.
- `GET /`: Metadatos del microservicio.

---

## ⚙️ Variables de Entorno (`.env`)

Crea un archivo `.env` basado en `.env.example`:

```env
PORT=3000

# Opción 1: Cadena de conexión para PostgreSQL (Supabase, Neon, Render Postgres)
DATABASE_URL=postgres://usuario:password@ep-ejemplo.us-east-2.aws.neon.tech/neondb?sslmode=require

# Opción 2: Cadena de conexión para MySQL (Railway, Aiven, Clever Cloud)
# DATABASE_URL=mysql://root:password@containers-us-west-1.railway.app:3306/railway

# Opción 3: Variables individuales (XAMPP local o MySQL)
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=pokemon_db
```

---

## 🛠️ Ejecución Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Modo producción
npm start
```

---

## ☁️ Despliegue en Render

1. Sube este repositorio a GitHub.
2. En [Render.com](https://render.com), haz clic en **New +** -> **Web Service**.
3. Selecciona tu repositorio y la carpeta raíz `backend`.
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. En **Environment Variables**, añade:
   - `DATABASE_URL`: Tu cadena de conexión de Supabase, Neon o Render PostgreSQL.
   - `PORT`: `10000` (Render lo inyecta por defecto).
7. Haz clic en **Create Web Service**. ¡Tu microservicio estará público con Swagger en `/api-docs`!
