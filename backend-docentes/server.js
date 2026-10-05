/**
 * Microservicio Agnóstico de Docentes UNINPAHU
 * Desarrollado con Node.js NATIVO (Módulo 'http') - SIN Express ni librerías de servidor web.
 * Conectado a Base de Datos Relacional (MySQL / PostgreSQL).
 * Soporta Path Params, Query Params y Documentación Swagger OpenAPI 3.0.
 */

const http = require("http");
const {
  initDatabase,
  getAllDocentes,
  getDocenteById,
  addDocente,
  updateDocente,
  deleteDocente,
  seedDatabase,
  checkHealth,
  getDbType,
} = require("./db");
const { swaggerDocument } = require("./swaggerSpec");

const PORT = process.env.PORT || 4000;

// Helper para enviar respuestas JSON con CORS habilitado
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  });
  res.end(JSON.stringify(data, null, 2));
}

// Plantilla HTML de Swagger UI interactivo (Renderizado directamente por HTTP nativo)
function getSwaggerHtml() {
  return `<!DOCTYPE html>
<html lang="es" notranslate class="notranslate">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <title>Microservicio Docentes UNINPAHU - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://uninpahu.edu.co/wp-content/uploads/2022/07/cropped-favicon-uninpahu-32x32.png" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #fafafa;
    }
    .uninpahu-topbar {
      background: #111827;
      color: #ffffff;
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .uninpahu-topbar .title {
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .uninpahu-topbar .badge {
      background: #ea580c;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }
    .swagger-ui .topbar { display: none !important; }
    .swagger-ui .info { margin: 24px 0 16px 0; }
    .swagger-ui .info .title { font-size: 32px; color: #111827; }
  </style>
</head>
<body notranslate class="notranslate">
  <header class="uninpahu-topbar">
    <div class="title">🏛️ UNINPAHU - Microservicio Agnóstico de Docentes</div>
    <div class="badge">Node.js HTTP Nativo + Base de Datos Relacional</div>
  </header>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
}

// Servidor HTTP Agnóstico
const server = http.createServer(async (req, res) => {
  // Manejo de preflight CORS (OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
  const searchParams = parsedUrl.searchParams;

  try {
    // 1. DOCUMENTACIÓN SWAGGER OPENAPI
    if (pathname === "/swagger.json") {
      return sendJson(res, 200, swaggerDocument);
    }

    if (pathname === "/api-docs" || pathname === "/docs") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(getSwaggerHtml());
    }

    // Redirección amigable desde la raíz a la documentación Swagger
    if (pathname === "/") {
      res.writeHead(302, { Location: "/api-docs" });
      return res.end();
    }

    // 2. HEALTH CHECK
    if (pathname === "/health") {
      const health = await checkHealth();
      return sendJson(res, health.status === "ok" ? 200 : 503, health);
    }

    // 3. SEMBRADO / RESTABLECIMIENTO (POST /api/docentes/seed)
    if (pathname === "/api/docentes/seed") {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 405, { error: "Use POST para sincronizar los docentes." });
      }
      const result = await seedDatabase();
      const all = await getAllDocentes();
      return sendJson(res, 200, {
        mensaje: "Base de datos sincronizada con docentes oficiales de UNINPAHU",
        total: all.length,
        motor: getDbType(),
        docentes: all,
      });
    }

    // 4. BÚSQUEDA ESPECIALIZADA POR QUERY PARAM (/api/docentes/buscar?q=...)
    if (pathname === "/api/docentes/buscar") {
      const query = searchParams.get("q") || "";
      const docentes = await getAllDocentes({ search: query });
      return sendJson(res, 200, {
        total: docentes.length,
        query,
        motor_bd: getDbType(),
        docentes,
      });
    }

    // 5. AGREGAR DOCENTE MEDIANTE QUERY PARAMS (POST /api/docentes/agregar?nombre=...)
    if (pathname === "/api/docentes/agregar") {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 405, { error: "Use POST y envíe los datos como query params." });
      }
      const requiredFields = ["nombre", "cargo"];
      const missingFields = requiredFields.filter((field) => !searchParams.get(field)?.trim());
      if (missingFields.length > 0) {
        return sendJson(res, 400, {
          error: `Complete los parámetros obligatorios: ${missingFields.join(", ")}.`,
        });
      }
      const nuevoDocente = await addDocente({
        nombre: searchParams.get("nombre"),
        cargo: searchParams.get("cargo"),
        programa: searchParams.get("programa"),
        facultad: searchParams.get("facultad"),
        correo: searchParams.get("correo"),
        imagen: searchParams.get("imagen"),
        perfil_completo: searchParams.get("perfil_completo"),
        formacion: searchParams.get("formacion"),
      });

      return sendJson(res, 201, {
        mensaje: "Docente agregado exitosamente a la base de datos relacional",
        motor_bd: getDbType(),
        docente: nuevoDocente,
      });
    }

    // 6. ACTUALIZAR DOCENTE POR PATH PARAM Y QUERY PARAMS (PUT /api/docentes/:id?...).
    const matchPathId = pathname.match(/^\/api\/docentes\/(\d+)$/);
    if (matchPathId && req.method === "PUT") {
      const id = matchPathId[1];
      const fields = [
        "nombre", "cargo", "programa", "facultad", "correo",
        "imagen", "linkedin", "perfil_completo", "formacion",
      ];
      const docenteData = {};
      for (const field of fields) {
        if (searchParams.has(field)) docenteData[field] = searchParams.get(field);
      }
      if (Object.keys(docenteData).length === 0) {
        return sendJson(res, 400, { error: "Indique al menos un campo para actualizar." });
      }
      if (Object.prototype.hasOwnProperty.call(docenteData, "nombre") && !docenteData.nombre.trim()) {
        return sendJson(res, 400, { error: "El nombre del docente no puede estar vacío." });
      }
      const docente = await updateDocente(id, docenteData);
      if (!docente) {
        return sendJson(res, 404, { error: `Docente con ID ${id} no encontrado.` });
      }
      return sendJson(res, 200, {
        mensaje: "Docente actualizado exitosamente.",
        motor_bd: getDbType(),
        docente,
      });
    }

    // 7. ELIMINAR DOCENTE POR PATH PARAM (DELETE /api/docentes/:id).
    if (matchPathId && req.method === "DELETE") {
      const id = matchPathId[1];
      const deleted = await deleteDocente(id);
      if (!deleted) {
        return sendJson(res, 404, { error: `Docente con ID ${id} no encontrado.` });
      }
      return sendJson(res, 200, {
        mensaje: "Docente eliminado exitosamente.",
        id: Number(id),
      });
    }

    // 8. CONSULTA POR PATH PARAM (/api/docentes/:id)
    if (matchPathId && req.method === "GET") {
      const id = matchPathId[1];
      const docente = await getDocenteById(id);
      if (!docente) {
        return sendJson(res, 404, {
          error: `Docente con ID ${id} no encontrado en la base de datos relacional`,
        });
      }
      return sendJson(res, 200, {
        docente,
        motor_bd: getDbType(),
      });
    }

    // 9. LISTADO GENERAL CON QUERY PARAMS (/api/docentes?search=...&programa=...)
    if (pathname === "/api/docentes") {
      if (req.method === "GET") {
        const search = searchParams.get("search") || "";
        const programa = searchParams.get("programa") || "";
        const docentes = await getAllDocentes({ search, programa });
        return sendJson(res, 200, {
          total: docentes.length,
          motor_bd: getDbType(),
          filtros: { search, programa },
          docentes,
        });
      }

    }

    // 404 - RUTA NO ENCONTRADA
    return sendJson(res, 404, {
      error: "Ruta no encontrada",
      ruta_solicitada: pathname,
      endpoints_disponibles: [
        "GET /api/docentes (Query params: ?search=...&programa=...)",
        "GET /api/docentes/:id (Path param)",
        "PUT /api/docentes/:id?nombre=...&cargo=... (Path y query params, sin body)",
        "DELETE /api/docentes/:id (Path param)",
        "GET /api/docentes/buscar?q=... (Query param)",
        "POST /api/docentes/agregar?nombre=...&cargo=... (Query params, sin body)",
        "POST /api/docentes/seed (Sin body)",
        "GET /health (Estado del servicio)",
        "GET /api-docs (Swagger UI)",
        "GET /swagger.json (OpenAPI 3.0)",
      ],
    });
  } catch (err) {
    console.error("Error en servidor agnóstico:", err);
    return sendJson(res, 500, {
      error: "Error interno del servidor",
      detalle: err.message,
    });
  }
});

// Inicialización de la base de datos y arranque del microservicio
async function start() {
  await initDatabase();
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 MICROSERVICIO DOCENTES UNINPAHU (Node.js Agnóstico)`);
    console.log(`📡 Servidor HTTP puro corriendo en http://localhost:${PORT}`);
    console.log(`📑 Documentación Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`📦 Especificación OpenAPI:  http://localhost:${PORT}/swagger.json`);
    console.log(`🔌 Motor de Base de Datos:    ${getDbType()}`);
    console.log(`=======================================================`);
  });
}

start().catch((error) => {
  console.error("No fue posible iniciar el microservicio de docentes:", error);
  process.exitCode = 1;
});

module.exports = { server };
