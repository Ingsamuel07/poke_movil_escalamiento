require("dotenv").config();

const { DOCENTES_INICIALES } = require("./seedData");

let pool = null;
let dbType = "none";
const valueOrNull = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const connectionUri =
  process.env.MYSQL_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

async function initDatabase() {
  if (connectionUri) {
    if (connectionUri.startsWith("postgres://") || connectionUri.startsWith("postgresql://")) {
      const { Pool } = require("pg");
      pool = new Pool({
        connectionString: connectionUri,
        ssl: connectionUri.includes("localhost") || connectionUri.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
      });
      await pool.query("SELECT 1");
      dbType = "postgres";
      console.log("-> Conectado a Base de Datos Relacional PostgreSQL");
    } else if (connectionUri.startsWith("mysql://") || connectionUri.startsWith("mysql2://")) {
      const mysql = require("mysql2/promise");
      pool = mysql.createPool(connectionUri);
      await pool.query("SELECT 1");
      dbType = "mysql";
      console.log("-> Conectado a Base de Datos Relacional MySQL");
    } else {
      throw new Error("DATABASE_URL debe usar el protocolo postgres://, postgresql:// o mysql://.");
    }
  } else if (process.env.DB_HOST || process.env.MYSQL_HOST) {
    const isPg = process.env.DB_CLIENT === "postgres" || process.env.DB_PORT === "5432";
    if (isPg) {
      const { Pool } = require("pg");
      pool = new Pool({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "uninpahu_db",
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      });
      await pool.query("SELECT 1");
      dbType = "postgres";
      console.log("-> Conectado a PostgreSQL");
    } else {
      const mysql = require("mysql2/promise");
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
        user: process.env.MYSQL_USER || process.env.DB_USER || "root",
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "uninpahu_db",
        waitForConnections: true,
        connectionLimit: 10,
      });
      await pool.query("SELECT 1");
      dbType = "mysql";
      console.log("-> Conectado a MySQL");
    }
  } else {
    throw new Error("Configure DATABASE_URL (PostgreSQL/MySQL) o las variables DB_HOST antes de iniciar el servicio.");
  }

  if (dbType === "mysql") {
    await setupMysqlTable();
  } else {
    await setupPostgresTable();
  }

  if ((await getAllDocentes()).length === 0) {
    await seedDatabase();
  }
}

async function setupMysqlTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS docentes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      cargo VARCHAR(255) NOT NULL,
      correo VARCHAR(255),
      imagen TEXT,
      linkedin VARCHAR(255),
      perfil_completo TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(createTableQuery);
  const [columns] = await pool.query("SHOW COLUMNS FROM docentes");
  const validColumns = new Set([
    "id",
    "nombre",
    "cargo",
    "correo",
    "imagen",
    "linkedin",
    "perfil_completo",
  ]);
  const columnsToDrop = columns
    .map((column) => column.Field)
    .filter((column) => !validColumns.has(column));
  if (columnsToDrop.length > 0) {
    for (const column of columnsToDrop) {
      await pool.query(`ALTER TABLE docentes DROP COLUMN ${column}`);
    }
  }
}

async function setupPostgresTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS docentes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      cargo VARCHAR(255) NOT NULL,
      correo VARCHAR(255),
      imagen TEXT,
      linkedin VARCHAR(255),
      perfil_completo TEXT
    );
  `;
  await pool.query(createTableQuery);
  await pool.query(`
    DO $$
    DECLARE
      existing_column RECORD;
    BEGIN
      FOR existing_column IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'docentes'
          AND column_name NOT IN (
            'id', 'nombre', 'cargo', 'correo', 'imagen', 'linkedin', 'perfil_completo'
          )
      LOOP
        EXECUTE format('ALTER TABLE docentes DROP COLUMN %I', existing_column.column_name);
      END LOOP;
    END;
    $$
  `);
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'docentes'
          AND column_name = 'id'
          AND is_identity = 'NO'
          AND column_default IS NULL
      ) THEN
        ALTER TABLE docentes
        ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
      END IF;
    END;
    $$
  `);
  await pool.query(`
    SELECT setval(
      pg_get_serial_sequence('docentes', 'id'),
      GREATEST(COALESCE(MAX(id), 1), 1),
      MAX(id) IS NOT NULL
    )
    FROM docentes
  `);
}

async function seedDatabase() {
  if (dbType === "mysql") {
    for (const d of DOCENTES_INICIALES) {
      await pool.query(
        `INSERT INTO docentes (id, nombre, cargo, correo, imagen, linkedin, perfil_completo)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         nombre=VALUES(nombre), cargo=VALUES(cargo), correo=VALUES(correo),
         imagen=VALUES(imagen), linkedin=VALUES(linkedin),
         perfil_completo=VALUES(perfil_completo)`,
        [
          d.id, d.nombre, d.cargo, d.correo, d.imagen, d.linkedin, d.perfil_completo
        ]
      );
    }
    return { ok: true, count: DOCENTES_INICIALES.length, db: "mysql" };
  } else if (dbType === "postgres") {
    for (const d of DOCENTES_INICIALES) {
      await pool.query(
        `INSERT INTO docentes (id, nombre, cargo, correo, imagen, linkedin, perfil_completo)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
         nombre=EXCLUDED.nombre, cargo=EXCLUDED.cargo, correo=EXCLUDED.correo,
         imagen=EXCLUDED.imagen, linkedin=EXCLUDED.linkedin,
         perfil_completo=EXCLUDED.perfil_completo`,
        [
          d.id, d.nombre, d.cargo, d.correo, d.imagen, d.linkedin, d.perfil_completo
        ]
      );
    }
    await pool.query(
      "SELECT setval(pg_get_serial_sequence('docentes', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM docentes"
    );
    return { ok: true, count: DOCENTES_INICIALES.length, db: "postgres" };
  }
}

async function getAllDocentes({ search = "" } = {}) {
  const searchTerm = search ? search.trim().toLowerCase() : "";

  if (dbType === "mysql") {
    let query = "SELECT * FROM docentes WHERE 1=1";
    const params = [];

    if (searchTerm) {
      query += " AND (LOWER(nombre) LIKE ? OR LOWER(cargo) LIKE ?)";
      const wild = `%${searchTerm}%`;
      params.push(wild, wild);
    }
    query += " ORDER BY id ASC";
    const [rows] = await pool.query(query, params);
    return rows;
  } else if (dbType === "postgres") {
    let query = "SELECT * FROM docentes WHERE 1=1";
    const params = [];
    let idx = 1;

    if (searchTerm) {
      query += ` AND (LOWER(nombre) LIKE $${idx} OR LOWER(cargo) LIKE $${idx})`;
      params.push(`%${searchTerm}%`);
      idx++;
    }
    query += " ORDER BY id ASC";
    const res = await pool.query(query, params);
    return res.rows;
  }
}

async function getDocenteById(id) {
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return null;

  if (dbType === "mysql") {
    const [rows] = await pool.query("SELECT * FROM docentes WHERE id = ? LIMIT 1", [numId]);
    return rows[0] || null;
  } else if (dbType === "postgres") {
    const res = await pool.query("SELECT * FROM docentes WHERE id = $1 LIMIT 1", [numId]);
    return res.rows[0] || null;
  }
}

async function addDocente(docenteData) {
  const requiredFields = ["nombre", "cargo"];
  for (const field of requiredFields) {
    if (typeof docenteData[field] !== "string" || !docenteData[field].trim()) {
      throw new Error(`El campo '${field}' es obligatorio.`);
    }
  }

  const nombre = docenteData.nombre.trim();
  const cargo = docenteData.cargo.trim();
  const correo = valueOrNull(docenteData.correo);
  const imagen = valueOrNull(docenteData.imagen);
  const linkedin = valueOrNull(docenteData.linkedin);
  const perfil_completo = valueOrNull(docenteData.perfil_completo);

  if (dbType === "mysql") {
    const [result] = await pool.query(
      `INSERT INTO docentes (nombre, cargo, correo, imagen, linkedin, perfil_completo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, cargo, correo, imagen, linkedin, perfil_completo]
    );
    return await getDocenteById(result.insertId);
  } else if (dbType === "postgres") {
    const res = await pool.query(
      `INSERT INTO docentes (nombre, cargo, correo, imagen, linkedin, perfil_completo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, cargo, correo, imagen, linkedin, perfil_completo]
    );
    return res.rows[0];
  }
}

async function updateDocente(id, docenteData) {
  const numId = Number.parseInt(id, 10);
  if (!Number.isInteger(numId) || numId < 1) return null;

  const fields = [
    "nombre",
    "cargo",
    "correo",
    "imagen",
    "linkedin",
    "perfil_completo",
  ].filter((field) => Object.prototype.hasOwnProperty.call(docenteData, field));

  if (fields.length === 0) {
    throw new Error("Debe indicar al menos un dato para actualizar.");
  }
  if (Object.prototype.hasOwnProperty.call(docenteData, "nombre") && !docenteData.nombre.trim()) {
    throw new Error("El nombre del docente no puede estar vacío.");
  }

  if (dbType === "mysql") {
    const assignments = fields.map((field) => `${field} = ?`);
    const values = fields.map((field) =>
      field === "nombre" || field === "cargo"
        ? docenteData[field].trim()
        : valueOrNull(docenteData[field])
    );
    await pool.query(
      `UPDATE docentes SET ${assignments.join(", ")} WHERE id = ?`,
      [...values, numId]
    );
    return getDocenteById(numId);
  } else if (dbType === "postgres") {
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    const values = fields.map((field) =>
      field === "nombre" || field === "cargo"
        ? docenteData[field].trim()
        : valueOrNull(docenteData[field])
    );
    values.push(numId);
    const result = await pool.query(
      `UPDATE docentes SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }
  return null;
}

async function deleteDocente(id) {
  const numId = Number.parseInt(id, 10);
  if (!Number.isInteger(numId) || numId < 1) return false;

  if (dbType === "mysql") {
    const [result] = await pool.query("DELETE FROM docentes WHERE id = ?", [numId]);
    return result.affectedRows > 0;
  } else if (dbType === "postgres") {
    const result = await pool.query(
      "DELETE FROM docentes WHERE id = $1 RETURNING id",
      [numId]
    );
    return result.rows.length > 0;
  }
  return false;
}

async function checkHealth() {
  const docentes = await getAllDocentes();
  return {
    status: "ok",
    service: "Microservicio Docentes UNINPAHU (Agnóstico Node.js)",
    engine: "Node.js Native HTTP (Sin Express)",
    database: {
      type: dbType,
      status: "connected",
      total_docentes: docentes.length,
    },
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  initDatabase,
  getAllDocentes,
  getDocenteById,
  addDocente,
  updateDocente,
  deleteDocente,
  seedDatabase,
  checkHealth,
  getDbType: () => dbType,
};
