from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware

import database
from schemas import (
    AnimeCharacter,
    AnimeCharacterCreate,
    AnimeListResponse,
    AnimeSingleResponse,
    GenericMessageResponse,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicializar la base de datos al arrancar
    database.init_db()
    yield

app = FastAPI(
    title="Microservicio Anime (Python & Base de Datos No Relacional)",
    description=(
        "Microservicio en Python (FastAPI) conectado a una base de datos no relacional "
        "(MongoDB Atlas en la nube) para gestionar y consultar 10 personajes de anime."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Permitir CORS para la aplicación móvil Expo y navegadores web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(
    "/",
    tags=["General"],
    summary="Información del microservicio",
    response_model=GenericMessageResponse,
)
def root():
    return {
        "mensaje": "Microservicio Anime (Python & MongoDB Atlas) en ejecución",
        "detalles": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "endpoints": {
                "listar_anime": "/api/anime",
                "buscar_personaje": "/api/anime/{id_or_name}",
                "sembrar_10_personajes": "/api/anime/seed",
            },
        },
    }

@app.get(
    "/health",
    tags=["General"],
    summary="Health check para Render y Railway",
)
def health_check():
    return {
        "status": "healthy",
        "mongo_conectado": database.is_connected_to_mongo,
    }

@app.get(
    "/api/anime",
    tags=["Anime"],
    summary="Listar los 10 personajes de anime desde la base de datos no relacional",
    response_model=AnimeListResponse,
)
def listar_personajes(
    search: Optional[str] = Query(None, description="Buscar por nombre, clan, aldea o anime")
):
    personajes = database.get_all_characters(search=search)
    return {
        "mensaje": "Lista de personajes de anime obtenida correctamente desde la base de datos no relacional",
        "total": len(personajes),
        "personajes": personajes,
    }

@app.get(
    "/api/anime/{id_or_name}",
    tags=["Anime"],
    summary="Obtener un personaje de anime por su ID o nombre",
    response_model=AnimeSingleResponse,
)
def obtener_personaje(id_or_name: str):
    personaje = database.get_character_by_id_or_name(id_or_name)
    if not personaje:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Personaje '{id_or_name}' no encontrado en la base de datos no relacional",
        )
    return {
        "mensaje": "Personaje de anime encontrado correctamente",
        "personaje": personaje,
    }

@app.post(
    "/api/anime",
    tags=["Anime"],
    summary="Crear un nuevo personaje de anime en la base de datos no relacional",
    response_model=AnimeSingleResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_personaje(personaje_in: AnimeCharacterCreate):
    char_dict = personaje_in.model_dump()
    guardado = database.create_or_update_character(char_dict)
    return {
        "mensaje": "Personaje guardado exitosamente en la base de datos no relacional",
        "personaje": guardado,
    }

@app.put(
    "/api/anime/{char_id}",
    tags=["Anime"],
    summary="Actualizar un personaje de anime por su ID",
    response_model=AnimeSingleResponse,
)
def actualizar_personaje(char_id: int, personaje_in: AnimeCharacterCreate):
    char_dict = personaje_in.model_dump()
    char_dict["id"] = char_id
    guardado = database.create_or_update_character(char_dict)
    return {
        "mensaje": "Personaje actualizado exitosamente",
        "personaje": guardado,
    }

@app.delete(
    "/api/anime/{char_id}",
    tags=["Anime"],
    summary="Eliminar un personaje de anime de la base de datos",
    response_model=GenericMessageResponse,
)
def eliminar_personaje(char_id: int):
    exito = database.delete_character(char_id)
    if not exito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró el personaje con id {char_id}",
        )
    return {
        "mensaje": f"Personaje con id {char_id} eliminado exitosamente",
    }

@app.post(
    "/api/anime/seed",
    tags=["Anime"],
    summary="Poblar o restablecer los 10 personajes oficiales de anime en la nube",
)
def poblar_personajes():
    resultado = database.seed_database()
    return resultado

# -------------------------------------------------------------
# Rutas de compatibilidad con la app móvil original (/api/naruto)
# -------------------------------------------------------------
@app.get(
    "/api/naruto",
    tags=["Compatibilidad Móvil"],
    summary="Listado compatible con la ruta original de Naruto",
)
def compatibilidad_naruto_lista():
    personajes = database.get_all_characters()
    return {
        "mensaje": "Personajes de anime",
        "personajes": personajes,
    }

@app.get(
    "/api/naruto/{nombre}",
    tags=["Compatibilidad Móvil"],
    summary="Búsqueda compatible con la ruta original de Naruto",
)
def compatibilidad_naruto_personaje(nombre: str):
    personaje = database.get_character_by_id_or_name(nombre)
    if not personaje:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Personaje de Naruto no encontrado",
        )
    return {
        "mensaje": "Personaje encontrado correctamente",
        "personaje": personaje,
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
