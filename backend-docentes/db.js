require("dotenv").config();

const { DOCENTES_INICIALES } = require("./seedData");

let pool = null;
let dbType = "none";

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
      programa VARCHAR(255) NOT NULL,
      facultad VARCHAR(255) NOT NULL,
      correo VARCHAR(255),
      telefono VARCHAR(100),
      sede VARCHAR(255),
      imagen TEXT,
      linkedin VARCHAR(255),
      resumen TEXT,
      perfil_completo TEXT,
      formacion TEXT,
      areas_investigacion TEXT,
      asignaturas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.query(createTableQuery);
}

async function setupPostgresTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS docentes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      cargo VARCHAR(255) NOT NULL,
      programa VARCHAR(255) NOT NULL,
      facultad VARCHAR(255) NOT NULL,
      correo VARCHAR(255),
      telefono VARCHAR(100),
      sede VARCHAR(255),
      imagen TEXT,
      linkedin VARCHAR(255),
      resumen TEXT,
      perfil_completo TEXT,
      formacion TEXT,
      areas_investigacion TEXT,
      asignaturas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
}

async function seedDatabase() {
  if (dbType === "mysql") {
    for (const d of DOCENTES_INICIALES) {
      await pool.query(
        `INSERT INTO docentes (id, nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         nombre=VALUES(nombre), cargo=VALUES(cargo), programa=VALUES(programa), facultad=VALUES(facultad),
         correo=VALUES(correo), telefono=VALUES(telefono), sede=VALUES(sede), imagen=VALUES(imagen),
         linkedin=VALUES(linkedin), resumen=VALUES(resumen), perfil_completo=VALUES(perfil_completo),
         formacion=VALUES(formacion), areas_investigacion=VALUES(areas_investigacion), asignaturas=VALUES(asignaturas)`,
        [
          d.id, d.nombre, d.cargo, d.programa, d.facultad, d.correo, d.telefono, d.sede,
          d.imagen, d.linkedin, d.resumen, d.perfil_completo, d.formacion, d.areas_investigacion, d.asignaturas
        ]
      );
    }
    return { ok: true, count: DOCENTES_INICIALES.length, db: "mysql" };
  } else if (dbType === "postgres") {
    for (const d of DOCENTES_INICIALES) {
      await pool.query(
        `INSERT INTO docentes (id, nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE SET
         nombre=EXCLUDED.nombre, cargo=EXCLUDED.cargo, programa=EXCLUDED.programa, facultad=EXCLUDED.facultad,
         correo=EXCLUDED.correo, telefono=EXCLUDED.telefono, sede=EXCLUDED.sede, imagen=EXCLUDED.imagen,
         linkedin=EXCLUDED.linkedin, resumen=EXCLUDED.resumen, perfil_completo=EXCLUDED.perfil_completo,
         formacion=EXCLUDED.formacion, areas_investigacion=EXCLUDED.areas_investigacion, asignaturas=EXCLUDED.asignaturas`,
        [
          d.id, d.nombre, d.cargo, d.programa, d.facultad, d.correo, d.telefono, d.sede,
          d.imagen, d.linkedin, d.resumen, d.perfil_completo, d.formacion, d.areas_investigacion, d.asignaturas
        ]
      );
    }
    await pool.query(
      "SELECT setval(pg_get_serial_sequence('docentes', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM docentes"
    );
    return { ok: true, count: DOCENTES_INICIALES.length, db: "postgres" };
  }
}

async function getAllDocentes({ search = "", programa = "" } = {}) {
  const searchTerm = search ? search.trim().toLowerCase() : "";
  const programaTerm = programa ? programa.trim().toLowerCase() : "";

  if (dbType === "mysql") {
    let query = "SELECT * FROM docentes WHERE 1=1";
    const params = [];

    if (searchTerm) {
      query += " AND (LOWER(nombre) LIKE ? OR LOWER(cargo) LIKE ? OR LOWER(programa) LIKE ? OR LOWER(asignaturas) LIKE ? OR LOWER(resumen) LIKE ?)";
      const wild = `%${searchTerm}%`;
      params.push(wild, wild, wild, wild, wild);
    }
    if (programaTerm) {
      query += " AND LOWER(programa) LIKE ?";
      params.push(`%${programaTerm}%`);
    }
    query += " ORDER BY id ASC";
    const [rows] = await pool.query(query, params);
    return rows;
  } else if (dbType === "postgres") {
    let query = "SELECT * FROM docentes WHERE 1=1";
    const params = [];
    let idx = 1;

    if (searchTerm) {
      query += ` AND (LOWER(nombre) LIKE $${idx} OR LOWER(cargo) LIKE $${idx} OR LOWER(programa) LIKE $${idx} OR LOWER(asignaturas) LIKE $${idx} OR LOWER(resumen) LIKE $${idx})`;
      params.push(`%${searchTerm}%`);
      idx++;
    }
    if (programaTerm) {
      query += ` AND LOWER(programa) LIKE $${idx}`;
      params.push(`%${programaTerm}%`);
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
  const nombre = docenteData.nombre || "Docente UNINPAHU";
  const cargo = docenteData.cargo || "Docente Catedrático FITI";
  const programa = docenteData.programa || "Ingeniería de Software";
  const facultad = docenteData.facultad || "Facultad de Ingeniería y Tecnologías de la Información (FITI)";
  const correo = docenteData.correo || `${nombre.toLowerCase().replace(/\s+/g, ".")}@uninpahu.edu.co`;
  const telefono = docenteData.telefono || "+57 (601) 3323500";
  const sede = docenteData.sede || "Sede Principal Bogotá (Calle 44 # 16-20)";
  const imagen = docenteData.imagen || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
  const linkedin = docenteData.linkedin || "https://www.linkedin.com/school/uninpahu/";
  const resumen = docenteData.resumen || `${nombre} es docente en el programa de ${programa} en UNINPAHU.`;
  const perfil_completo = docenteData.perfil_completo || `${nombre} cuenta con amplia experiencia académica y profesional en ${programa}, aportando al desarrollo tecnológico de la comunidad de UNINPAHU.`;
  const formacion = docenteData.formacion || `Profesional en ${programa} | Especialista Universitario`;
  const areas_investigacion = docenteData.areas_investigacion || "Ingeniería de Software, Bases de Datos Relacionales, Arquitecturas de TI.";
  const asignaturas = docenteData.asignaturas || "Ingeniería de Software, Bases de Datos, Programación.";

  if (dbType === "mysql") {
    const [result] = await pool.query(
      `INSERT INTO docentes (nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas]
    );
    return await getDocenteById(result.insertId);
  } else if (dbType === "postgres") {
    const res = await pool.query(
      `INSERT INTO docentes (nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas]
    );
    return res.rows[0];
  }
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
  seedDatabase,
  checkHealth,
  getDbType: () => dbType,
};
