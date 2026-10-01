# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN LA NUBE Y ARQUITECTURA

Este proyecto implementa una arquitectura distribuida compuesta por dos microservicios independientes con sus propias bases de datos en la nube y una aplicación móvil Expo / React Native que los consume.

---

## 📐 1. Arquitectura del Sistema

```
                    ┌──────────────────────────────────────────┐
                    │      APLICACIÓN MÓVIL (EXPO / RN)        │
                    │   Configuración Dinámica de URLs en App  │
                    └─────────────┬──────────────┬─────────────┘
                                  │              │
                   HTTP / REST    │              │ HTTP / REST
                                  ▼              ▼
┌───────────────────────────────────────┐  ┌──────────────────────────────────────┐
│  MICROSERVICIO 1 (NODE.JS / EXPRESS)  │  │   MICROSERVICIO 2 (PYTHON / FASTAPI) │
│  - Documentación Swagger (/api-docs)  │  │   - Documentación Swagger (/docs)    │
│  - CRUD & Seed de 10 Pokémon          │  │   - CRUD & Seed de 10 Anime Heroes   │
│  - Desplegado en Render / Railway     │  │   - Desplegado en Render / Railway   │
└──────────────────┬────────────────────┘  └──────────────────┬───────────────────┘
                   │                                          │
                   │ Conexión Relacional                      │ Conexión NoSQL
                   ▼                                          ▼
┌───────────────────────────────────────┐  ┌──────────────────────────────────────┐
│     BASE DE DATOS RELACIONAL NUBE     │  │    BASE DE DATOS NO RELACIONAL NUBE  │
│  (Supabase / Neon / Render PostgreSQL │  │          (MongoDB Atlas M0)          │
│          o Railway MySQL)             │  │                                      │
│  Almacena los 10 Pokémon Oficiales    │  │   Almacena los 10 Personajes Anime   │
└───────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 🗄️ 2. Base de Datos Relacional en la Nube (10 Pokémon)

### Opciones Gratuitas Recomendadas:
1. **Neon** ([neon.tech](https://neon.tech)) - Servidor PostgreSQL gratuito serverless.
2. **Supabase** ([supabase.com](https://supabase.com)) - PostgreSQL gestionado gratuito.
3. **Render PostgreSQL** ([render.com](https://render.com)) - Base de datos PostgreSQL gratuita por 30 días.
4. **Railway MySQL** ([railway.app](https://railway.app)) - Base de datos relacional MySQL.

### Pasos de Configuración (Ejemplo Neon / Supabase):
1. Crea una cuenta gratuita en [neon.tech](https://neon.tech) o [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto llamado `pokemon-db`.
3. Copia la cadena de conexión (`Connection String`), por ejemplo:
   ```
   postgres://alex:secretpassword@ep-green-wind.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Auto-inicialización**: El microservicio de Node.js **crea la tabla e inserta automáticamente los 10 Pokémon en su primer arranque**. No obstante, si deseas ejecutar el script manualmente, ejecuta el contenido de:
   ```
   backend/pokemon_relational_schema_and_seed.sql
   ```

### Los 10 Pokémon Almacenados:
1. `Pikachu` (ID: 25) - Eléctrico
2. `Charizard` (ID: 6) - Fuego / Volador
3. `Blastoise` (ID: 9) - Agua
4. `Venusaur` (ID: 3) - Planta / Veneno
5. `Gengar` (ID: 94) - Fantasma / Veneno
6. `Mewtwo` (ID: 150) - Psíquico
7. `Lucario` (ID: 448) - Lucha / Acero
8. `Greninja` (ID: 658) - Agua / Siniestro
9. `Eevee` (ID: 133) - Normal
10. `Snorlax` (ID: 143) - Normal

---

## 🍃 3. Base de Datos No Relacional en la Nube (10 Personajes de Anime)

### Configuración en MongoDB Atlas (Free Tier M0):
1. Regístrate gratis en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Haz clic en **Create Deployment** y selecciona el plan **M0 Free (Shared)**.
3. En **Security Quickstart**:
   - Crea un usuario y contraseña de base de datos (ej. usuario: `admin`, contraseña: `MiPassword123`).
   - En **IP Access List**, selecciona **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Ve a **Database** -> **Connect** -> **Drivers (Python)**.
5. Copia tu URI de conexión:
   ```
   mongodb+srv://admin:MiPassword123@cluster0.abcde.mongodb.net/anime_db?retryWrites=true&w=majority
   ```
6. **Auto-sembrado**: Al conectar el microservicio de Python, detectará la colección y sembrará automáticamente los 10 personajes.

### Los 10 Personajes de Anime Almacenados:
1. `Naruto Uzumaki` (*Naruto Shippuden*) - Modo Sabio & Kurama
2. `Sasuke Uchiha` (*Naruto Shippuden*) - Sharingan & Rinnegan
3. `Kakashi Hatake` (*Naruto Shippuden*) - Chidori & Raikiri
4. `Itachi Uchiha` (*Naruto Shippuden*) - Tsukuyomi & Susanoo
5. `Monkey D. Luffy` (*One Piece*) - Gear 5 Nika & Haki
6. `Roronoa Zoro` (*One Piece*) - Estilo Tres Espadas & Asura
7. `Son Goku` (*Dragon Ball Z*) - Ultra Instinct & Kamehameha
8. `Tanjiro Kamado` (*Demon Slayer*) - Danza del Dios del Fuego
9. `Gojo Satoru` (*Jujutsu Kaisen*) - Infinito & Vacío Inconmensurable
10. `Levi Ackerman` (*Attack on Titan*) - Soldado más Fuerte de la Humanidad

---

## ⚡ 4. Despliegue del Microservicio Node.js en Render o Railway

### En Render.com:
1. Crea una cuenta en [Render.com](https://render.com).
2. Haz clic en **New +** -> **Web Service**.
3. Conecta tu repositorio de GitHub.
4. Completa la configuración:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. En **Environment Variables**:
   - `DATABASE_URL`: *(Tu cadena de Neon/Supabase/Render Postgres)*
6. Haz clic en **Create Web Service**.
7. Tu Swagger estará disponible en:
   ```
   https://tu-servicio-node.onrender.com/api-docs
   ```

### En Railway.app:
1. En Railway, haz clic en **New Project** -> **Deploy from GitHub repo**.
2. Selecciona la carpeta `backend`.
3. En **Variables**, añade `DATABASE_URL`.
4. Railway detectará `npm start` automáticamente.

---

## 🐍 5. Despliegue del Microservicio Python en Render o Railway

### En Render.com:
1. En [Render.com](https://render.com), haz clic en **New +** -> **Web Service**.
2. Conecta tu repositorio de GitHub.
3. Completa la configuración:
   - **Root Directory**: `backend-python`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. En **Environment Variables**:
   - `MONGODB_URI`: *(Tu cadena de MongoDB Atlas)*
   - `DB_NAME`: `anime_db`
5. Haz clic en **Create Web Service**.
6. Tu Swagger interactivo estará disponible en:
   ```
   https://tu-servicio-python.onrender.com/docs
   ```

---

## 📱 6. Ejecución y Configuración de la App Móvil (Expo)

### Ejecución Local:
```bash
cd frontend
npm start
```
- Presiona `w` para abrir en navegador Web.
- O escanea el código QR con **Expo Go** en tu dispositivo Android/iOS.

### Configuración en Vivo de URLs desde la Aplicación:
1. En la aplicación móvil, haz clic en el icono de **⚙️ (Configuración)** en la esquina superior derecha de la pantalla de Pokémon o Anime.
2. Ingresa tus URLs públicas desplegadas en Render:
   - **Microservicio Pokémon**: `https://tu-servicio-node.onrender.com/api`
   - **Microservicio Anime**: `https://tu-servicio-python.onrender.com/api`
3. Presiona **PROBAR CONEXIÓN** para verificar que ambos servicios responden (mostrará puntos verdes 🟢).
4. Presiona **SEMBRAR 10 + 10 EN NUBE** para asegurar que ambas bases de datos remotas tengan los registros listos.
5. Presiona **GUARDAR Y APLICAR**.
6. ¡Listo! La aplicación móvil consumirá de inmediato tus microservicios y bases de datos en la nube.
