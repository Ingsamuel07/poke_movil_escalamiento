require("dotenv").config();
const { SEED_POKEMONS } = require("../services/pokemonSeedData");

let pool = null;
let dbType = "none"; // 'postgres' | 'mysql' | 'memory'

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.POSTGRES_URL || "";

function initDatabase() {
  if (connectionUri) {
    if (connectionUri.startsWith("postgres://") || connectionUri.startsWith("postgresql://")) {
      const { Pool } = require("pg");
      pool = new Pool({
        connectionString: connectionUri,
        ssl: connectionUri.includes("localhost") || connectionUri.includes("127.0.0.1") ? false : { rejectUnauthorized: false }
      });
      dbType = "postgres";
      console.log("-> Conectando a Base de Datos Relacional PostgreSQL (Nube)...");
    } else {
      const mysql = require("mysql2/promise");
      pool = mysql.createPool({
        uri: connectionUri,
        waitForConnections: true,
        connectionLimit: 10,
        ssl: connectionUri.includes("localhost") || connectionUri.includes("127.0.0.1") ? undefined : { rejectUnauthorized: false }
      });
      dbType = "mysql";
      console.log("-> Conectando a Base de Datos Relacional MySQL (Nube por URI)...");
    }
  } else if (process.env.DB_HOST) {
    if (process.env.DB_CLIENT === "postgres" || process.env.DB_PORT === "5432") {
      const { Pool } = require("pg");
      pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "pokemon_db",
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
      });
      dbType = "postgres";
      console.log("-> Conectando a PostgreSQL mediante parámetros individuales...");
    } else {
      const mysql = require("mysql2/promise");
      pool = mysql.createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "pokemon_db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      dbType = "mysql";
      console.log("-> Conectando a MySQL mediante parámetros individuales...");
    }
  } else {
    // Si no hay configuración de base de datos en nube, inicializar modo memoria/fallback
    dbType = "memory";
    console.warn("-> AVISO: No se detectó DATABASE_URL ni DB_HOST. Usando almacenamiento en memoria con los 10 Pokémon.");
  }
}

initDatabase();

// Memoria fallback
let memoryPokemons = JSON.parse(JSON.stringify(SEED_POKEMONS));

/**
 * Ejecuta una consulta agnóstica entre Postgres y MySQL
 */
async function query(sql, params = []) {
  if (dbType === "memory" || !pool) {
    return runMemoryQuery(sql, params);
  }

  try {
    if (dbType === "postgres") {
      // Convertir '?' a '$1, $2, ...' para PostgreSQL
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      const res = await pool.query(pgSql, params);
      return [res.rows, res];
    } else {
      // MySQL
      const res = await pool.query(sql, params);
      return res; // [rows, fields]
    }
  } catch (error) {
    console.error(`Error en consulta a base de datos (${dbType}):`, error.message);
    // Si falla la conexión con el servidor en la nube, caer al almacenamiento en memoria de respaldo
    console.warn("Utilizando fallback en memoria temporalmente...");
    return runMemoryQuery(sql, params);
  }
}

function runMemoryQuery(sql, params = []) {
  const upperSql = sql.trim().toUpperCase();
  if (upperSql.startsWith("SELECT")) {
    if (params.length > 0) {
      const paramVal = String(params[0]).toLowerCase();
      const numVal = Number(params[params.length - 1]);
      const found = memoryPokemons.filter(
        (p) => String(p.id) === paramVal || p.nombre.toLowerCase() === paramVal || p.id === numVal
      );
      return [found, []];
    }
    return [memoryPokemons, []];
  }

  if (upperSql.startsWith("INSERT")) {
    const id = params[0];
    const existingIndex = memoryPokemons.findIndex((p) => p.id === id);
    const newRecord = {
      id: params[0],
      nombre: params[1],
      altura: params[2],
      peso: params[3],
      imagen: params[4],
      species: params[5],
      movimientos: params[6],
      tipos: params[7],
      habilidades: params[8],
      stats: params[9]
    };
    if (existingIndex >= 0) {
      memoryPokemons[existingIndex] = newRecord;
    } else {
      memoryPokemons.push(newRecord);
    }
    return [{ affectedRows: 1 }, []];
  }

  return [[], []];
}

/**
 * Inicializa la tabla en la nube si no existe y siembra los 10 pokémons
 */
async function ensureTableAndSeed() {
  if (dbType === "memory" || !pool) {
    return;
  }

  try {
    if (dbType === "postgres") {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pokemon (
          id INT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          altura INT,
          peso INT,
          imagen TEXT,
          species VARCHAR(100),
          tipos TEXT,
          habilidades TEXT,
          stats TEXT,
          movimientos TEXT
        );
      `);
      const countRes = await pool.query("SELECT COUNT(*) as count FROM pokemon");
      const count = Number(countRes.rows[0].count);
      if (count === 0) {
        console.log("-> Sembrando 10 Pokémon en PostgreSQL en la nube...");
        for (const p of SEED_POKEMONS) {
          await pool.query(
            `INSERT INTO pokemon (id, nombre, altura, peso, imagen, species, tipos, habilidades, stats, movimientos)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [
              p.id,
              p.nombre,
              p.altura,
              p.peso,
              p.imagen,
              p.species,
              JSON.stringify(p.tipos),
              JSON.stringify(p.habilidades),
              JSON.stringify(p.stats),
              JSON.stringify(p.movimientos)
            ]
          );
        }
        console.log("-> 10 Pokémon sembrados exitosamente en PostgreSQL!");
      }
    } else if (dbType === "mysql") {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pokemon (
          id INT NOT NULL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          altura INT DEFAULT NULL,
          peso INT DEFAULT NULL,
          imagen TEXT DEFAULT NULL,
          species VARCHAR(100) DEFAULT NULL,
          tipos LONGTEXT DEFAULT NULL,
          habilidades LONGTEXT DEFAULT NULL,
          stats LONGTEXT DEFAULT NULL,
          movimientos LONGTEXT DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      const [rows] = await pool.query("SELECT COUNT(*) as count FROM pokemon");
      const count = rows[0]?.count || 0;
      if (count === 0) {
        console.log("-> Sembrando 10 Pokémon en MySQL en la nube...");
        for (const p of SEED_POKEMONS) {
          await pool.query(
            `INSERT INTO pokemon (id, nombre, altura, peso, imagen, species, tipos, habilidades, stats, movimientos)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`,
            [
              p.id,
              p.nombre,
              p.altura,
              p.peso,
              p.imagen,
              p.species,
              JSON.stringify(p.tipos),
              JSON.stringify(p.habilidades),
              JSON.stringify(p.stats),
              JSON.stringify(p.movimientos)
            ]
          );
        }
        console.log("-> 10 Pokémon sembrados exitosamente en MySQL!");
      }
    }
  } catch (err) {
    console.warn("Aviso en ensureTableAndSeed:", err.message);
  }
}

// Ejecutar verificación de tabla en segundo plano
ensureTableAndSeed().catch((e) => console.warn("Error al inicializar base relacional:", e.message));

module.exports = {
  query,
  ensureTableAndSeed,
  getDbType: () => dbType,
  resetMemoryPokemons: () => {
    memoryPokemons = JSON.parse(JSON.stringify(SEED_POKEMONS));
  }
};