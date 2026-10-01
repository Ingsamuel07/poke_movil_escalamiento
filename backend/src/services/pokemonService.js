const db = require("../config/db");
const { SEED_POKEMONS } = require("./pokemonSeedData");

function parseField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
}

function formatRow(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    nombre: row.nombre,
    altura: Number(row.altura || 0),
    peso: Number(row.peso || 0),
    imagen: row.imagen || "",
    species: row.species || row.nombre,
    tipos: parseField(row.tipos),
    habilidades: parseField(row.habilidades),
    stats: parseField(row.stats),
    movimientos: parseField(row.movimientos),
    moves: parseField(row.movimientos), // compatibilidad
  };
}

/**
 * Obtener todos los 10 pokémons de la base de datos relacional
 */
const getAllPokemons = async (search = "") => {
  try {
    let sql = "SELECT * FROM pokemon";
    let params = [];

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      sql += " WHERE LOWER(nombre) LIKE ? OR CAST(id AS CHAR) = ?";
      params = [term, search.trim()];
    } else {
      sql += " ORDER BY id ASC";
    }

    let [rows] = await db.query(sql, params);

    // Si la tabla está vacía, sembrar automáticamente los 10 pokémons
    if (!rows || rows.length === 0) {
      if (!search) {
        console.log("Tabla vacía. Sembrando 10 Pokémon en la base de datos relacional...");
        await seedPokemons();
        const [reseeded] = await db.query("SELECT * FROM pokemon ORDER BY id ASC");
        rows = reseeded || SEED_POKEMONS;
      }
    }

    return (rows || []).map(formatRow);
  } catch (error) {
    console.error("Error al obtener pokémons en la BD relacional:", error.message);
    // Retornar pokémons de respaldo
    let result = SEED_POKEMONS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.nombre.toLowerCase().includes(q) || String(p.id) === q);
    }
    return result.map(formatRow);
  }
};

/**
 * Obtener un pokémon específico por ID o nombre
 */
const getPokemon = async (pokemonIdentifier) => {
  if (!pokemonIdentifier) {
    throw new Error("No se recibió el nombre o ID del Pokémon");
  }

  const queryTerm = String(pokemonIdentifier).trim().toLowerCase();
  const numericId = isNaN(queryTerm) ? -1 : Number(queryTerm);

  try {
    const [rows] = await db.query(
      "SELECT * FROM pokemon WHERE LOWER(nombre) = ? OR id = ?",
      [queryTerm, numericId]
    );

    if (rows && rows.length > 0) {
      return formatRow(rows[0]);
    }

    // Buscar en la lista oficial de 10 si la BD aún no ha sincronizado
    const inSeed = SEED_POKEMONS.find(
      (p) => p.nombre.toLowerCase() === queryTerm || p.id === numericId
    );
    if (inSeed) {
      // Guardarlo en la BD relacional
      await createPokemon(inSeed).catch(() => {});
      return formatRow(inSeed);
    }

    // Fallback: Si no está en los 10 almacenados, intentar PokeAPI
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${queryTerm}`);
      if (response.ok) {
        const data = await response.json();
        const newPokemon = {
          id: data.id,
          nombre: data.name,
          altura: data.height,
          peso: data.weight,
          imagen:
            data.sprites?.other?.["official-artwork"]?.front_default ||
            data.sprites?.front_default ||
            "",
          species: data.species?.name || data.name,
          tipos: data.types?.map((item) => item.type.name) || [],
          habilidades: data.abilities?.map((item) => item.ability.name) || [],
          stats: data.stats?.map((item) => ({
            nombre: item.stat.name,
            valor: item.base_stat,
          })) || [],
          movimientos: data.moves?.slice(0, 15).map((item) => item.move.name) || [],
        };
        await createPokemon(newPokemon).catch(() => {});
        return formatRow(newPokemon);
      }
    } catch (apiErr) {
      console.warn("Fallback PokeAPI falló:", apiErr.message);
    }

    throw new Error("Pokémon no encontrado en la base de datos");
  } catch (error) {
    console.error("Error en getPokemon:", error.message);
    throw error;
  }
};

/**
 * Crear o actualizar un pokémon en la base relacional
 */
const createPokemon = async (data) => {
  const pokemon = {
    id: Number(data.id),
    nombre: String(data.nombre || data.name).trim().toLowerCase(),
    altura: Number(data.altura || data.height || 0),
    peso: Number(data.peso || data.weight || 0),
    imagen: data.imagen || data.sprites?.front_default || "",
    species: data.species || data.nombre,
    tipos: data.tipos || data.types || [],
    habilidades: data.habilidades || data.abilities || [],
    stats: data.stats || [],
    movimientos: data.movimientos || data.moves || [],
  };

  const isPostgres = db.getDbType() === "postgres";

  if (isPostgres) {
    await db.query(
      `INSERT INTO pokemon (id, nombre, altura, peso, imagen, species, tipos, habilidades, stats, movimientos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         altura = EXCLUDED.altura,
         peso = EXCLUDED.peso,
         imagen = EXCLUDED.imagen,
         species = EXCLUDED.species,
         tipos = EXCLUDED.tipos,
         habilidades = EXCLUDED.habilidades,
         stats = EXCLUDED.stats,
         movimientos = EXCLUDED.movimientos`,
      [
        pokemon.id,
        pokemon.nombre,
        pokemon.altura,
        pokemon.peso,
        pokemon.imagen,
        pokemon.species,
        JSON.stringify(pokemon.tipos),
        JSON.stringify(pokemon.habilidades),
        JSON.stringify(pokemon.stats),
        JSON.stringify(pokemon.movimientos),
      ]
    );
  } else {
    // MySQL / Memory
    await db.query(
      `INSERT INTO pokemon (id, nombre, altura, peso, imagen, species, tipos, habilidades, stats, movimientos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nombre = VALUES(nombre),
         altura = VALUES(altura),
         peso = VALUES(peso),
         imagen = VALUES(imagen),
         species = VALUES(species),
         tipos = VALUES(tipos),
         habilidades = VALUES(habilidades),
         stats = VALUES(stats),
         movimientos = VALUES(movimientos)`,
      [
        pokemon.id,
        pokemon.nombre,
        pokemon.altura,
        pokemon.peso,
        pokemon.imagen,
        pokemon.species,
        JSON.stringify(pokemon.tipos),
        JSON.stringify(pokemon.habilidades),
        JSON.stringify(pokemon.stats),
        JSON.stringify(pokemon.movimientos),
      ]
    );
  }

  return formatRow(pokemon);
};

/**
 * Sembrar o restablecer los 10 pokémons en la BD relacional
 */
const seedPokemons = async () => {
  console.log(`Sembrando los 10 Pokémon en la base de datos relacional (${db.getDbType()})...`);
  for (const pokemon of SEED_POKEMONS) {
    await createPokemon(pokemon);
  }
  return {
    mensaje: "Se han sembrado exitosamente los 10 Pokémon en la base de datos relacional",
    total: SEED_POKEMONS.length,
    pokemons: SEED_POKEMONS.map((p) => p.nombre),
  };
};

module.exports = {
  getAllPokemons,
  getPokemon,
  createPokemon,
  seedPokemons,
};