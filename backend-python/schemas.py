from typing import List, Optional
from pydantic import BaseModel, Field

class AnimeCharacterCreate(BaseModel):
    id: Optional[int] = Field(None, example=11, description="Identificador único del personaje")
    nombre: str = Field(..., example="Monkey D. Luffy", description="Nombre completo del personaje")
    anime: str = Field(..., example="One Piece", description="Nombre del anime")
    clan: Optional[str] = Field("Desconocido", example="Clan de los D.", description="Clan o linaje")
    aldea: Optional[str] = Field("Desconocida", example="Villa Foosha", description="Aldea, ciudad o procedencia")
    rango: Optional[str] = Field("Guerrero", example="Capitán Pirata", description="Rango ninja o rol militar")
    imagen: str = Field(..., example="https://cdn.myanimelist.net/images/characters/9/131317.jpg", description="URL de la imagen principal")
    imagenes: List[str] = Field(default_factory=list, example=["https://cdn.myanimelist.net/images/characters/9/131317.jpg"], description="Lista de hasta 3 URLs de imágenes")
    jutsus: List[str] = Field(default_factory=list, example=["Gomu Gomu no Pistol", "Gear Second"], description="Técnicas, jutsus o habilidades principales")
    naturalezas: List[str] = Field(default_factory=list, example=["Haki de Armamento"], description="Naturalezas de chakra o elementos mágicos")
    descripcion: Optional[str] = Field("", example="Capitán de los Piratas de Sombrero de Paja", description="Biografía resumida")
    familia: Optional[str] = Field("No disponible", example="Monkey D. Dragon (Padre)", description="Relaciones familiares o afiliaciones")

class AnimeCharacter(AnimeCharacterCreate):
    id: int = Field(..., example=1)

class AnimeListResponse(BaseModel):
    mensaje: str = Field(..., example="Lista de personajes de anime obtenida correctamente")
    total: int = Field(..., example=10)
    personajes: List[AnimeCharacter]

class AnimeSingleResponse(BaseModel):
    mensaje: str = Field(..., example="Personaje de anime encontrado")
    personaje: AnimeCharacter

class GenericMessageResponse(BaseModel):
    mensaje: str = Field(..., example="Operación exitosa")
    detalles: Optional[dict] = None
