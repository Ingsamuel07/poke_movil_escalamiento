# 🍃 Microservicio Anime (Python FastAPI & Base de Datos No Relacional)

Microservicio REST desarrollado en **Python (FastAPI)** conectado a una **base de datos no relacional en la nube (MongoDB Atlas)** para gestionar y consultar 10 personajes de anime.

---

## 🚀 Características
- **Base de Datos No Relacional**: Conexión nativa a MongoDB Atlas mediante `pymongo`. Colección: `personajes` en la base de datos `anime_db`.
- **Auto-sembrado y Tolerancia a Fallos**: Si la colección está vacía al iniciar o no hay conexión inmediata, provee y sincroniza automáticamente los 10 personajes oficiales de anime.
- **Documentación Swagger / OpenAPI 3.1 Automática**: Disponible en `/docs` (Swagger UI) y `/redoc` (ReDoc).
- **Listo para Render / Railway**: Incluye `requirements.txt`, `Procfile`, `render.yaml` y `Dockerfile`.

---

## 📚 Endpoints y Swagger

Accede a la documentación interactiva en:
```
http://localhost:8000/docs
```
O en producción:
```
https://tu-servicio-python.onrender.com/docs
```

### Rutas principales:
- `GET /api/anime`: Lista los 10 personajes de anime de MongoDB Atlas (soporta `?search=`).
- `GET /api/anime/{id_or_name}`: Busca un personaje por nombre (ej. `Luffy`, `Goku`) o ID (ej. `1`).
- `POST /api/anime`: Agrega un nuevo personaje de anime a la colección.
- `PUT /api/anime/{char_id}`: Actualiza un personaje existente.
- `DELETE /api/anime/{char_id}`: Elimina un personaje.
- `POST /api/anime/seed`: Siembra o restablece los 10 personajes oficiales en MongoDB Atlas.
- `GET /api/naruto` y `GET /api/naruto/{nombre}`: Rutas de compatibilidad con versiones anteriores de la app móvil.
- `GET /health`: Healthcheck para plataformas cloud.
- `GET /`: Metadatos del microservicio y accesos rápidos.

---

## ⚙️ Variables de Entorno (`.env`)

Crea un archivo `.env` basado en `.env.example`:

```env
PORT=8000

# Cadena de conexión de MongoDB Atlas (Cloud NoSQL)
MONGODB_URI=mongodb+srv://usuario:password@cluster0.abcde.mongodb.net/anime_db?retryWrites=true&w=majority

# Base de datos
DB_NAME=anime_db
```

---

## 🛠️ Ejecución Local

```bash
# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
venv\Scripts\activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor FastAPI
python main.py
# o también:
uvicorn main:app --reload --port 8000
```

---

## ☁️ Despliegue en Render

1. Sube este repositorio a GitHub.
2. En [Render.com](https://render.com), haz clic en **New +** -> **Web Service**.
3. Selecciona tu repositorio y la carpeta raíz `backend-python`.
4. **Environment**: `Python 3`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. En **Environment Variables**, añade:
   - `MONGODB_URI`: Tu cadena de conexión de MongoDB Atlas.
   - `DB_NAME`: `anime_db`
8. Haz clic en **Create Web Service**. ¡Tu microservicio estará público con Swagger en `/docs`!
