import os
import copy
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from seed_data import SEED_ANIME_CHARACTERS

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("DB_NAME", "anime_db")
COLLECTION_NAME = "personajes"

mongo_client = None
db = None
collection = None
is_connected_to_mongo = False

# Respaldo en memoria
memory_characters = copy.deepcopy(SEED_ANIME_CHARACTERS)

def init_db():
    global mongo_client, db, collection, is_connected_to_mongo
    if MONGODB_URI and ("mongodb" in MONGODB_URI):
        try:
            from pymongo import MongoClient
            mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            # Verificar conexión
            mongo_client.admin.command('ping')
            db = mongo_client[DB_NAME]
            collection = db[COLLECTION_NAME]
            is_connected_to_mongo = True
            print("-> Conectado exitosamente a MongoDB Atlas (Base No Relacional en la Nube)")
            
            # Auto-sembrado si la colección está vacía
            count = collection.count_documents({})
            if count == 0:
                print("-> Colección vacía en MongoDB Atlas. Sembrando los 10 personajes de anime...")
                seed_database()
        except Exception as e:
            is_connected_to_mongo = False
            print(f"-> AVISO: No se pudo conectar a MongoDB Atlas ({e}). Utilizando almacén en memoria con los 10 personajes.")
    else:
        print("-> AVISO: MONGODB_URI no configurado. Utilizando almacén en memoria con los 10 personajes de anime.")

def seed_database() -> Dict[str, Any]:
    global memory_characters
    memory_characters = copy.deepcopy(SEED_ANIME_CHARACTERS)
    
    if is_connected_to_mongo and collection is not None:
        try:
            for char in SEED_ANIME_CHARACTERS:
                collection.replace_one(
                    {"id": char["id"]},
                    char,
                    upsert=True
                )
            return {
                "mensaje": "Los 10 personajes de anime fueron sembrados exitosamente en MongoDB Atlas",
                "total": len(SEED_ANIME_CHARACTERS),
                "almacenamiento": "MongoDB Atlas (NoSQL en la Nube)",
                "personajes": [c["nombre"] for c in SEED_ANIME_CHARACTERS]
            }
        except Exception as e:
            print(f"Error al sembrar en MongoDB: {e}")
            
    return {
        "mensaje": "Los 10 personajes de anime fueron cargados en memoria (configura MONGODB_URI para nube)",
        "total": len(memory_characters),
        "almacenamiento": "Memoria local",
        "personajes": [c["nombre"] for c in memory_characters]
    }

def get_all_characters(search: Optional[str] = None) -> List[Dict[str, Any]]:
    if is_connected_to_mongo and collection is not None:
        try:
            query = {}
            if search and search.strip():
                s = search.strip()
                query = {
                    "$or": [
                        {"nombre": {"$regex": s, "$options": "i"}},
                        {"anime": {"$regex": s, "$options": "i"}},
                        {"clan": {"$regex": s, "$options": "i"}},
                        {"aldea": {"$regex": s, "$options": "i"}}
                    ]
                }
            cursor = collection.find(query, {"_id": 0})
            results = list(cursor)
            if results:
                return results
            if not search:
                # Si está vacío, sembrar y retornar
                seed_database()
                return list(collection.find({}, {"_id": 0}))
        except Exception as e:
            print(f"Error al leer de MongoDB Atlas: {e}")

    # Fallback memoria
    data = memory_characters
    if search and search.strip():
        s = search.strip().lower()
        data = [
            c for c in data
            if s in c.get("nombre", "").lower()
            or s in c.get("anime", "").lower()
            or s in c.get("clan", "").lower()
            or s in c.get("aldea", "").lower()
            or str(c.get("id")) == s
        ]
    return data

def get_character_by_id_or_name(identifier: str) -> Optional[Dict[str, Any]]:
    ident = str(identifier).strip()
    is_numeric = ident.isdigit()
    num_id = int(ident) if is_numeric else -1

    if is_connected_to_mongo and collection is not None:
        try:
            query = {
                "$or": [
                    {"nombre": {"$regex": f"^{ident}$", "$options": "i"}},
                    {"id": num_id}
                ]
            }
            doc = collection.find_one(query, {"_id": 0})
            if doc:
                return doc
        except Exception as e:
            print(f"Error al buscar en MongoDB Atlas: {e}")

    # Fallback memoria
    for c in memory_characters:
        if c.get("nombre", "").lower() == ident.lower() or c.get("id") == num_id:
            return c
            
    # Búsqueda parcial si no hubo coincidencia exacta
    for c in memory_characters:
        if ident.lower() in c.get("nombre", "").lower():
            return c
            
    return None

def create_or_update_character(char_data: Dict[str, Any]) -> Dict[str, Any]:
    global memory_characters
    char_id = char_data.get("id")
    if not char_id:
        char_id = max([c.get("id", 0) for c in memory_characters] or [0]) + 1
        char_data["id"] = char_id

    if is_connected_to_mongo and collection is not None:
        try:
            collection.update_one(
                {"id": char_id},
                {"$set": char_data},
                upsert=True
            )
        except Exception as e:
            print(f"Error al guardar en MongoDB Atlas: {e}")

    # Actualizar memoria
    existing_idx = next((i for i, c in enumerate(memory_characters) if c.get("id") == char_id), -1)
    if existing_idx >= 0:
        memory_characters[existing_idx] = char_data
    else:
        memory_characters.append(char_data)

    return char_data

def delete_character(char_id: int) -> bool:
    global memory_characters
    deleted = False
    if is_connected_to_mongo and collection is not None:
        try:
            res = collection.delete_one({"id": char_id})
            deleted = res.deleted_count > 0
        except Exception as e:
            print(f"Error al borrar de MongoDB: {e}")

    prev_len = len(memory_characters)
    memory_characters = [c for c in memory_characters if c.get("id") != char_id]
    if len(memory_characters) < prev_len:
        deleted = True

    return deleted
