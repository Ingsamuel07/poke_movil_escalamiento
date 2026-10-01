const db = require("../config/db");

// Datos predeterminados de respaldo para personajes comunes de Naruto
const FALLBACK_NARUTO_CHARACTERS = {
  naruto: {
    id: 1,
    nombre: "Naruto Uzumaki",
    clan: "Uzumaki",
    aldea: "Konohagakure (Aldea de la Hoja)",
    rango: "Hokage / Genin",
    imagen: "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
      "https://static.wikia.nocookie.net/naruto/images/7/7d/Naruto_Part_II.png",
      "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png"
    ],
    jutsus: [
      "Rasengan",
      "Kage Bunshin no Jutsu (Clones de Sombras)",
      "Rasenshuriken",
      "Modo Sabio (Sage Mode)",
      "Modo Chakra de Kurama",
      "Oodama Rasengan"
    ],
    naturalezas: ["Viento", "Rayo", "Tierra", "Agua", "Fuego"],
    descripcion: "Séptimo Hokage de Konoha y Jinchūriki de Kurama (Zorro de Nueve Colas). Héroe de la Cuarta Guerra Mundial Shinobi.",
    familia: "Minato Namikaze (padre), Kushina Uzumaki (madre), Hinata Hyūga (esposa), Boruto (hijo), Himawari (hija)"
  },
  sasuke: {
    id: 2,
    nombre: "Sasuke Uchiha",
    clan: "Uchiha",
    aldea: "Konohagakure (Aldea de la Hoja)",
    rango: "Genin / Ninja Renegado",
    imagen: "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
      "https://static.wikia.nocookie.net/naruto/images/1/13/Sasuke_Part_2.png",
      "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png"
    ],
    jutsus: [
      "Chidori",
      "Kirin",
      "Amaterasu",
      "Susanoo",
      "Katon: Goukakyuu no Jutsu (Gran Bola de Fuego)",
      "Chibaku Tensei"
    ],
    naturalezas: ["Rayo", "Fuego", "Viento", "Tierra", "Agua"],
    descripcion: "Último superviviente del clan Uchiha, portador del Sharingan y Rinnegan, considerado el único rival de Naruto Uzumaki.",
    familia: "Fugaku Uchiha (padre), Mikoto Uchiha (madre), Itachi Uchiha (hermano), Sakura Haruno (esposa), Sarada (hija)"
  },
  sakura: {
    id: 3,
    nombre: "Sakura Haruno",
    clan: "Uchiha / Haruno",
    aldea: "Konohagakure (Aldea de la Hoja)",
    rango: "Jōnin / Ninja Médico",
    imagen: "https://static.wikia.nocookie.net/naruto/images/6/64/Sakura_Part_1.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/6/64/Sakura_Part_1.png",
      "https://static.wikia.nocookie.net/naruto/images/b/ba/Sakurap2.png",
      "https://static.wikia.nocookie.net/naruto/images/6/64/Sakura_Part_1.png"
    ],
    jutsus: [
      "Fuerza Sobrehumana",
      "Ninjutsu Médico Avanzado",
      "Sello Byakugou",
      "Invocación de Katsuyu",
      "Palma Recuperadora"
    ],
    naturalezas: ["Tierra", "Agua", "Yin", "Yang"],
    descripcion: "La mejor ninja médico del mundo ninja tras Tsunade, integrante legendaria del Equipo 7 con fuerza demoledora.",
    familia: "Kizashi Haruno (padre), Mebuki Haruno (madre), Sasuke Uchiha (esposo), Sarada Uchiha (hija)"
  },
  kakashi: {
    id: 4,
    nombre: "Kakashi Hatake",
    clan: "Hatake",
    aldea: "Konohagakure (Aldea de la Hoja)",
    rango: "Sexto Hokage / Ex-Jōnin",
    imagen: "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
      "https://static.wikia.nocookie.net/naruto/images/2/25/Kakashi_Part_III.png",
      "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png"
    ],
    jutsus: [
      "Raikiri (Cortador de Relámpago)",
      "Kamui (Mangekyō Sharingan)",
      "Invocación Ninken (Perros Ninja)",
      "Doton: Doryūheki (Muro de Tierra)",
      "Chidori"
    ],
    naturalezas: ["Rayo", "Fuego", "Agua", "Tierra", "Viento"],
    descripcion: "Conocido mundialmente como el Ninja que Copia gracias a haber copiado más de mil jutsus.",
    familia: "Sakumo Hatake 'El Colmillo Blanco' (padre)"
  },
  itachi: {
    id: 5,
    nombre: "Itachi Uchiha",
    clan: "Uchiha",
    aldea: "Konohagakure / Akatsuki",
    rango: "Ninja Renegado / Ex-Anbu",
    imagen: "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
      "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
      "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png"
    ],
    jutsus: [
      "Tsukuyomi",
      "Amaterasu",
      "Susanoo (con Espada Totsuka y Espejo Yata)",
      "Izanami",
      "Katon: Gran Bola de Fuego"
    ],
    naturalezas: ["Fuego", "Agua", "Viento", "Yin", "Yang"],
    descripcion: "Prodigio de Konoha que sacrificó su reputación e historia para proteger su aldea y a su hermano Sasuke.",
    familia: "Fugaku Uchiha (padre), Mikoto Uchiha (madre), Sasuke Uchiha (hermano menor)"
  },
  hinata: {
    id: 6,
    nombre: "Hinata Hyūga",
    clan: "Hyūga / Uzumaki",
    aldea: "Konohagakure (Aldea de la Hoja)",
    rango: "Chūnin",
    imagen: "https://static.wikia.nocookie.net/naruto/images/9/97/Hinata_Part_II.png",
    imagenes: [
      "https://static.wikia.nocookie.net/naruto/images/9/97/Hinata_Part_II.png",
      "https://static.wikia.nocookie.net/naruto/images/9/97/Hinata_Part_II.png",
      "https://static.wikia.nocookie.net/naruto/images/9/97/Hinata_Part_II.png"
    ],
    jutsus: [
      "Byakugan",
      "Jūken (Puño Suave)",
      "Paso Suave Doble Puño de León",
      "Ocho Trigramas Sesenta y Cuatro Palmas"
    ],
    naturalezas: ["Rayo", "Fuego"],
    descripcion: "Heredera de la rama principal del clan Hyūga y esposa de Naruto Uzumaki.",
    familia: "Hiashi Hyūga (padre), Hanabi Hyūga (hermana), Neji Hyūga (primo), Naruto Uzumaki (esposo)"
  }
};

const getNarutoCharacter = async (query) => {
  if (!query || !query.trim()) {
    throw new Error("No se recibió el nombre del personaje de Naruto");
  }

  const queryNormalized = String(query).trim().toLowerCase();

  // 1. Intentar consumir API de JsonGPT (https://jsongpt.com/api/naruto)
  try {
    const jsonGptUrl = `https://api.jsongpt.com/json?prompt=Generate details on Naruto character ${queryNormalized}&character_name&origin&species&abilities&affiliations&images`;
    const gptRes = await fetch(jsonGptUrl, { headers: { Accept: "application/json" } });
    if (gptRes.ok) {
      const gptData = await gptRes.json();
      if (gptData && (gptData.character_name || gptData.name)) {
        const charName = gptData.character_name || gptData.name;
        const images = Array.isArray(gptData.images) && gptData.images.length > 0
          ? gptData.images
          : [
              "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
              "https://static.wikia.nocookie.net/naruto/images/7/7d/Naruto_Part_II.png",
              "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png"
            ];

        return {
          id: Date.now(),
          nombre: charName,
          clan: gptData.origin || gptData.clan || "Shinobi",
          aldea: gptData.affiliations || gptData.village || "Konohagakure",
          rango: gptData.species || "Ninja",
          imagen: images[0],
          imagenes: [images[0], images[1] || images[0], images[2] || images[0]],
          jutsus: Array.isArray(gptData.abilities) ? gptData.abilities : [gptData.abilities || "Ninjutsu"],
          naturalezas: ["Chakra"],
          descripcion: `Personaje obtenido de JsonGPT API: ${charName}`,
          familia: "Desconocida"
        };
      }
    }
  } catch (gptErr) {
    console.warn("Aviso JsonGPT (https://jsongpt.com/api/naruto):", gptErr.message);
  }

  // 2. Intentar consumir API pública Dattebayo (fallback dinámico en línea)
  try {
    const apiRes = await fetch(
      `https://dattebayo-api.onrender.com/characters?name=${encodeURIComponent(queryNormalized)}`
    );
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      const list = apiData.characters || (Array.isArray(apiData) ? apiData : []);
      if (list.length > 0) {
        const item = list[0];
        const rawImages = item.images && item.images.length > 0
          ? item.images
          : ["https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png"];

        const img1 = rawImages[0];
        const img2 = rawImages[1] || rawImages[0];
        const img3 = rawImages[2] || rawImages[0];

        const clan = item.personal?.clan || "Desconocido";
        const aldea = Array.isArray(item.personal?.affiliation)
          ? item.personal.affiliation.join(", ")
          : (item.personal?.affiliation || "Konohagakure");
        const rango = typeof item.rank?.ninjaRank === "object"
          ? Object.values(item.rank.ninjaRank).join(" / ")
          : (item.rank?.ninjaRank || "Ninja");

        const jutsus = Array.isArray(item.jutsu) ? item.jutsu.slice(0, 15) : [];
        const naturalezas = Array.isArray(item.natureType) ? item.natureType : [];

        let familia = "Información no disponible";
        if (item.family && typeof item.family === "object") {
          familia = Object.entries(item.family)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" | ");
        }

        const characterResult = {
          id: item.id || Date.now(),
          nombre: item.name,
          clan: clan,
          aldea: aldea,
          rango: rango,
          imagen: img1,
          imagenes: [img1, img2, img3],
          jutsus: jutsus,
          naturalezas: naturalezas,
          descripcion: `Shinobi destacado del mundo de Naruto (${aldea}).`,
          familia: familia
        };

        // Guardar en MySQL de forma no bloqueante
        try {
          await db.execute(
            `INSERT INTO naruto (nombre, clan, aldea, rango, imagen_principal, imagenes, jutsus, descripcion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
              clan = VALUES(clan),
              aldea = VALUES(aldea),
              rango = VALUES(rango),
              imagen_principal = VALUES(imagen_principal),
              imagenes = VALUES(imagenes),
              jutsus = VALUES(jutsus),
              descripcion = VALUES(descripcion)`,
            [
              characterResult.nombre,
              characterResult.clan,
              characterResult.aldea,
              characterResult.rango,
              characterResult.imagen,
              JSON.stringify(characterResult.imagenes),
              JSON.stringify(characterResult.jutsus),
              characterResult.descripcion
            ]
          );
        } catch (dbErr) {
          console.warn("Aviso al guardar en BD Naruto:", dbErr.message);
        }

        return characterResult;
      }
    }
  } catch (apiErr) {
    console.warn("Aviso consultando API Dattebayo:", apiErr.message);
  }

  // 3. Buscar en la base de datos local MySQL
  try {
    const [rows] = await db.query(
      "SELECT * FROM naruto WHERE LOWER(nombre) LIKE ? LIMIT 1",
      [`%${queryNormalized}%`]
    );
    if (rows && rows.length > 0) {
      const row = rows[0];
      let imgs = [row.imagen_principal, row.imagen_principal, row.imagen_principal];
      if (row.imagenes) {
        try {
          imgs = JSON.parse(row.imagenes);
        } catch {
          imgs = [row.imagen_principal, row.imagen_principal, row.imagen_principal];
        }
      }
      let jutsus = [];
      if (row.jutsus) {
        try {
          jutsus = JSON.parse(row.jutsus);
        } catch {
          jutsus = [];
        }
      }

      return {
        id: row.id,
        nombre: row.nombre,
        clan: row.clan || "Desconocido",
        aldea: row.aldea || "Konohagakure",
        rango: row.rango || "Ninja",
        imagen: row.imagen_principal,
        imagenes: imgs,
        jutsus: jutsus,
        naturalezas: [],
        descripcion: row.descripcion || "",
        familia: "No disponible"
      };
    }
  } catch (dbQueryErr) {
    console.warn("Aviso consultando MySQL naruto:", dbQueryErr.message);
  }

  // 4. Buscar en diccionario de personajes predeterminados
  const matchedKey = Object.keys(FALLBACK_NARUTO_CHARACTERS).find(
    (key) => key.includes(queryNormalized) || queryNormalized.includes(key)
  );

  if (matchedKey) {
    const preset = FALLBACK_NARUTO_CHARACTERS[matchedKey];
    // Guardar en MySQL
    try {
      await db.execute(
        `INSERT INTO naruto (nombre, clan, aldea, rango, imagen_principal, imagenes, jutsus, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          clan = VALUES(clan),
          aldea = VALUES(aldea),
          rango = VALUES(rango),
          imagen_principal = VALUES(imagen_principal),
          imagenes = VALUES(imagenes),
          jutsus = VALUES(jutsus),
          descripcion = VALUES(descripcion)`,
        [
          preset.nombre,
          preset.clan,
          preset.aldea,
          preset.rango,
          preset.imagen,
          JSON.stringify(preset.imagenes),
          JSON.stringify(preset.jutsus),
          preset.descripcion
        ]
      );
    } catch (e) {
      // Ignorar error de guardado
    }
    return preset;
  }

  throw new Error("Personaje de Naruto no encontrado");
};

const getPopularCharacters = () => {
  return Object.values(FALLBACK_NARUTO_CHARACTERS);
};

module.exports = {
  getNarutoCharacter,
  getPopularCharacters,
};
