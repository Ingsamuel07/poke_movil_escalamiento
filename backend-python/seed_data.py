"""
10 Personajes de Anime para la base de datos no relacional (MongoDB Atlas)
"""

SEED_ANIME_CHARACTERS = [
    {
        "id": 1,
        "nombre": "Naruto Uzumaki",
        "anime": "Naruto Shippuden",
        "clan": "Clan Uzumaki",
        "aldea": "Aldea de la Hoja (Konohagakure)",
        "rango": "Séptimo Hokage",
        "imagen": "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
        "imagenes": [
            "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
            "https://cdn.myanimelist.net/images/characters/2/284121.jpg",
            "https://static.wikia.nocookie.net/naruto/images/0/09/Naruto_newshot.png"
        ],
        "jutsus": [
            "Rasengan",
            "Kage Bunshin no Jutsu",
            "Futon: Rasenshuriken",
            "Modo Sabio (Senjutsu)",
            "Modo Chakra de Kurama",
            "Bijuudama"
        ],
        "naturalezas": ["Viento", "Fuego", "Rayo", "Tierra", "Agua", "Yin-Yang"],
        "descripcion": "Ninja prodigio e hiperactivo de Konohagakure, portador de Kurama y héroe de la Cuarta Guerra Mundial Ninja que alcanzó el sueño de convertirse en Séptimo Hokage.",
        "familia": "Minato Namikaze (Padre) | Kushina Uzumaki (Madre) | Hinata Hyuga (Esposa) | Boruto & Himawari (Hijos)"
    },
    {
        "id": 2,
        "nombre": "Sasuke Uchiha",
        "anime": "Naruto Shippuden",
        "clan": "Clan Uchiha",
        "aldea": "Konohagakure / Nómada",
        "rango": "Hokage de las Sombras",
        "imagen": "https://cdn.myanimelist.net/images/characters/9/131317.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/9/131317.jpg",
            "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
            "https://static.wikia.nocookie.net/naruto/images/1/13/Sasuke_Uchiha.png"
        ],
        "jutsus": [
            "Chidori",
            "Sharingan",
            "Mangekyo Sharingan Eterno",
            "Amaterasu",
            "Susanoo Perfecto",
            "Rinnegan Supremo"
        ],
        "naturalezas": ["Fuego", "Rayo", "Yin"],
        "descripcion": "Último sobreviviente de élite del legendario Clan Uchiha, portador de los Dojutsus más temidos y protector errante del mundo ninja.",
        "familia": "Fugaku Uchiha (Padre) | Mikoto Uchiha (Madre) | Itachi Uchiha (Hermano) | Sakura Haruno (Esposa) | Sarada (Hija)"
    },
    {
        "id": 3,
        "nombre": "Kakashi Hatake",
        "anime": "Naruto Shippuden",
        "clan": "Clan Hatake",
        "aldea": "Aldea de la Hoja (Konohagakure)",
        "rango": "Sexto Hokage / Comandante Jonin",
        "imagen": "https://cdn.myanimelist.net/images/characters/7/284123.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/7/284123.jpg",
            "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
            "https://static.wikia.nocookie.net/naruto/images/7/79/Kakashi_infobox.png"
        ],
        "jutsus": [
            "Raikiri (Cuchilla Relámpago)",
            "Kamui (Mangekyo Sharingan)",
            "Chidori",
            "Doton: Doryuheki",
            "Suiton: Suiryudan no Jutsu"
        ],
        "naturalezas": ["Rayo", "Tierra", "Agua", "Fuego", "Viento"],
        "descripcion": "Mundialmente conocido como el 'Ninja que Copia' tras haber replicado más de mil jutsus gracias al Sharingan legado por Obito Uchiha.",
        "familia": "Sakumo Hatake 'El Colmillo Blanco de Konoha' (Padre)"
    },
    {
        "id": 4,
        "nombre": "Itachi Uchiha",
        "anime": "Naruto Shippuden",
        "clan": "Clan Uchiha",
        "aldea": "Aldea de la Hoja / Akatsuki",
        "rango": "Capitán Anbu / Criminal Clase S",
        "imagen": "https://cdn.myanimelist.net/images/characters/16/75046.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/16/75046.jpg",
            "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi_Uchiha.png",
            "https://static.wikia.nocookie.net/naruto/images/0/0c/Itachi_in_Akatsuki.png"
        ],
        "jutsus": [
            "Tsukuyomi",
            "Amaterasu",
            "Susanoo (Espada Totsuka & Espejo Yata)",
            "Izanami",
            "Katon: Gokakyu no Jutsu",
            "Genjutsu de Cuervos"
        ],
        "naturalezas": ["Fuego", "Agua", "Viento", "Yin", "Yang"],
        "descripcion": "Genio silencioso que cargó con el desprecio del mundo al exterminar a su clan para evitar una guerra civil, protegiendo a su aldea y a su hermano menor desde las sombras.",
        "familia": "Fugaku Uchiha (Padre) | Mikoto Uchiha (Madre) | Sasuke Uchiha (Hermano)"
    },
    {
        "id": 5,
        "nombre": "Monkey D. Luffy",
        "anime": "One Piece",
        "clan": "Clan de los D. / Sombreros de Paja",
        "aldea": "Villa Foosha (East Blue)",
        "rango": "Capitán Pirata / Uno de los Cuatro Emperadores (Yonko)",
        "imagen": "https://cdn.myanimelist.net/images/characters/9/131317.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/9/131317.jpg",
            "https://static.wikia.nocookie.net/onepiece/images/6/6d/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png",
            "https://static.wikia.nocookie.net/onepiece/images/a/af/Gear_5_Anime_Infobox.png"
        ],
        "jutsus": [
            "Gomu Gomu no Pistol",
            "Gear Second",
            "Gear Third (Gigant Pistol)",
            "Gear Fourth (Snakeman / Bounceman)",
            "Gear Fifth (Guerrero de la Liberación Sun God Nika)",
            "Haki del Conquistador Avanzado"
        ],
        "naturalezas": ["Fruta Hito Hito no Mi Modelo Nika", "Haki de Armamento", "Haki de Observación"],
        "descripcion": "Capitán soñador de los Piratas de Sombrero de Paja, consumidor de la legendaria fruta mítica Nika, decidido a liberar los mares y convertirse en el Rey de los Piratas.",
        "familia": "Monkey D. Dragon (Padre) | Monkey D. Garp (Abuelo) | Portgas D. Ace & Sabo (Hermanos Jurados)"
    },
    {
        "id": 6,
        "nombre": "Roronoa Zoro",
        "anime": "One Piece",
        "clan": "Clan Shimotsuki / Sombreros de Paja",
        "aldea": "Villa Shimotsuki (East Blue)",
        "rango": "Espadachín Maestro / Cazador de Piratas",
        "imagen": "https://cdn.myanimelist.net/images/characters/3/100534.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/3/100534.jpg",
            "https://static.wikia.nocookie.net/onepiece/images/5/56/Roronoa_Zoro_Anime_Post_Timeskip_Infobox.png",
            "https://static.wikia.nocookie.net/onepiece/images/4/4b/Zoro_Enma_Infobox.png"
        ],
        "jutsus": [
            "Santoryu: Onigiri",
            "Santoryu Ogi: Sanzen Sekai",
            "Kiki Kyutoryu: Asura",
            "Senhachiju Pound Ho",
            "Estilo del Rey del Infierno (En-O Santoryu)"
        ],
        "naturalezas": ["Espadas Legendarias (Wado Ichimonji, Sandai Kitetsu, Enma)", "Haki del Conquistador"],
        "descripcion": "Temible espadachín portador de tres katanas que juró a su difunta amiga Kuina convertirse en el mejor espadachín del mundo tras superar a Dracule Mihawk.",
        "familia": "Shimotsuki Ushimaru (Ancestro) | Koushirou (Maestro)"
    },
    {
        "id": 7,
        "nombre": "Son Goku",
        "anime": "Dragon Ball Z",
        "clan": "Raza Saiyajin",
        "aldea": "Planeta Vegeta / Monte Paoz",
        "rango": "Defensor Supremo del Universo 7",
        "imagen": "https://cdn.myanimelist.net/images/characters/7/384204.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/7/384204.jpg",
            "https://static.wikia.nocookie.net/dragonball/images/e/e0/Goku_infobox_DBSuper.png",
            "https://static.wikia.nocookie.net/dragonball/images/7/75/GokuUltraInstinct.png"
        ],
        "jutsus": [
            "Kamehameha",
            "Genkidama (Bomba de Energía)",
            "Kaioken",
            "Teletransportación Instantánea",
            "Super Saiyajin (1, 2, 3, Blue)",
            "Doctrina Egoísta (Ultra Instinct)"
        ],
        "naturalezas": ["Ki Divino Saiyajin", "Energía Espiritual"],
        "descripcion": "Guerrero Saiyajin criado en la Tierra con un corazón noble y una sed insaciable de superación que ha salvado a la Tierra y al multiverso en innumerables ocasiones.",
        "familia": "Bardock (Padre) | Gine (Madre) | Raditz (Hermano) | Chi-Chi (Esposa) | Gohan & Goten (Hijos)"
    },
    {
        "id": 8,
        "nombre": "Tanjiro Kamado",
        "anime": "Demon Slayer (Kimetsu no Yaiba)",
        "clan": "Familia Kamado",
        "aldea": "Montaña Kumotori",
        "rango": "Cazador de Demonios (Kanoe)",
        "imagen": "https://cdn.myanimelist.net/images/characters/11/382902.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/11/382902.jpg",
            "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d4/Tanjiro_anime_design.png",
            "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/8/86/Tanjiro_Sun_Breathing.png"
        ],
        "jutsus": [
            "Respiración del Agua (Mizu no Kokyu)",
            "Danza del Dios del Fuego (Hinokami Kagura)",
            "Respiración Solar Primigenia",
            "Mundo Transparente",
            "Olfato Agudo Sobrenatural"
        ],
        "naturalezas": ["Agua", "Sol / Fuego"],
        "descripcion": "Joven espadachín de corazón bondadoso que se une al Cuerpo de Exterminio de Demonios para vengar a su familia y hallar una cura para su hermana Nezuko.",
        "familia": "Tanjuro Kamado (Padre) | Kie Kamado (Madre) | Nezuko Kamado (Hermana)"
    },
    {
        "id": 9,
        "nombre": "Gojo Satoru",
        "anime": "Jujutsu Kaisen",
        "clan": "Clan Gojo",
        "aldea": "Colegio Técnico de Magia Metropolitana de Tokio",
        "rango": "Hechicero de Grado Especial",
        "imagen": "https://cdn.myanimelist.net/images/characters/15/422168.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/15/422168.jpg",
            "https://static.wikia.nocookie.net/jujutsu-kaisen/images/5/58/Satoru_Gojo_anime.png",
            "https://static.wikia.nocookie.net/jujutsu-kaisen/images/7/7d/Unlimited_Void.png"
        ],
        "jutsus": [
            "Técnica de Maldición Ilimitada (Mukagen)",
            "Azul (Atracción Gravitacional)",
            "Rojo (Repulsión Espacial)",
            "Púrpura Hueco (Kyoshiki Murasaki)",
            "Expansión Territorial: Vacío Inconmensurable (Muryokusho)"
        ],
        "naturalezas": ["Seis Ojos (Rikugan)", "Energía Maldita Ilimitada"],
        "descripcion": "El hechicero de Jujutsu más poderoso de la era moderna, mentor de la nueva generación y poseedor absoluto de los legendarios Seis Ojos.",
        "familia": "Descendiente de Michizane Sugawara (Uno de los Tres Grandes Espíritus Vengativos)"
    },
    {
        "id": 10,
        "nombre": "Levi Ackerman",
        "anime": "Attack on Titan (Shingeki no Kyojin)",
        "clan": "Clan Ackerman",
        "aldea": "Ciudad Subterránea / Muralla Rose",
        "rango": "Capitán del Escuadrón de Operaciones Especiales",
        "imagen": "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
        "imagenes": [
            "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
            "https://static.wikia.nocookie.net/shingekinokyojin/images/9/94/Levi_Ackermann_%28Anime%29_character_image.png",
            "https://static.wikia.nocookie.net/shingekinokyojin/images/c/c1/Levi_ODM_Gear.png"
        ],
        "jutsus": [
            "Técnica de Cuchillas Giratorias Letal",
            "Maniobras Tridimensionales Avanzadas (EDM3)",
            "Lanzas Relámpago",
            "Poder Despertado Ackerman",
            "Reflejos de Combate Insuperables"
        ],
        "naturalezas": ["Linaje Ackerman", "Combate Físico y Táctico"],
        "descripcion": "Conocido como 'El soldado más fuerte de la humanidad', líder implacable de la Legión de Reconocimiento capaz de someter a Titanes colosales con una velocidad asombrosa.",
        "familia": "Kuchel Ackerman (Madre) | Kenny Ackerman 'El Destripador' (Tío)"
    }
]
