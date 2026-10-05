/**
 * Especificación OpenAPI 3.0 para el Microservicio Agnóstico de Docentes UNINPAHU
 */
const docenteQueryFields = [
  ["nombre", "Nombre completo", "ELFAR DIDIER MORANTES SANCHEZ"],
  ["cargo", "Cargo o especialidad", "Profesor Universitario"],
  ["programa", "Programa académico", "Ingeniería de Software"],
  ["facultad", "Facultad", "Facultad FITI"],
  ["correo", "Correo institucional", "docente@uninpahu.edu.co"],
  ["imagen", "URL de imagen", "https://example.com/docente.jpg"],
  ["linkedin", "Perfil de LinkedIn", "https://linkedin.com/in/docente"],
  ["perfil_completo", "Perfil completo", "Trayectoria académica y profesional"],
  ["formacion", "Formación", "Profesional y especialista"],
];

const docenteQueryParameters = docenteQueryFields.map(([name, description, example]) => ({
  name,
  in: "query",
  required: false,
  description,
  schema: { type: "string", example },
}));

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Microservicio Docentes UNINPAHU (Node.js Agnóstico & BD Relacional en la Nube)",
    version: "1.0.0",
    description:
      "Microservicio desarrollado con el módulo HTTP nativo de Node.js, sin frameworks como Express. Conectado a una base de datos relacional en la nube (PostgreSQL o MySQL). Los datos de entrada se reciben mediante Path Params o Query Params; no se utilizan parámetros en el body.\n\n[ELFAR DIDIER MORANTES SANCHEZ - Facultad FITI UNINPAHU - Website](https://www.linkedin.com/in/elfar-didier-morantes-s%C3%A1nchez/)\n\n[Send email to ELFAR DIDIER MORANTES SANCHEZ - Facultad FITI UNINPAHU](mailto:emorantessa@uninpahu.edu.co)",
    contact: {
      name: "ELFAR DIDIER MORANTES SANCHEZ - Facultad FITI UNINPAHU",
      email: "emorantessa@uninpahu.edu.co",
      url: "https://www.linkedin.com/in/elfar-didier-morantes-s%C3%A1nchez/",
    },
  },
  servers: [
    {
      url: "/",
      description: "Este mismo servicio (Render o desarrollo local)",
    },
  ],
  tags: [
    {
      name: "Docentes UNINPAHU",
      description: "Consultas, búsquedas y operaciones sobre docentes en la base de datos relacional",
    },
    {
      name: "Administración de la base de datos",
      description: "Gestión de registros y sembrado en la base de datos relacional",
    },
  ],
  paths: {
    "/api/docentes": {
      get: {
        tags: ["Docentes UNINPAHU"],
        summary: "Listar docentes con filtros opcionales (Query Params)",
        description:
          "Recupera la lista de docentes registrados en la base de datos relacional. Permite filtrar por palabra clave o por programa académico utilizando parámetros de consulta.",
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            description: "Filtro de búsqueda por nombre, cargo o programa académico (Query Param)",
            schema: {
              type: "string",
              example: "morantes",
            },
          },
          {
            name: "programa",
            in: "query",
            required: false,
            description: "Filtro por programa académico de UNINPAHU (Query Param)",
            schema: {
              type: "string",
              example: "Ingeniería de Software",
            },
          },
        ],
        responses: {
          200: {
            description: "Lista de docentes obtenida satisfactoriamente desde la base de datos relacional",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 6 },
                    docentes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Docente" },
                    },
                    motor_bd: { type: "string", example: "mysql" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/docentes/{id}": {
      get: {
        tags: ["Docentes UNINPAHU"],
        summary: "Consultar docente por ID (Path Param)",
        description:
          "Recupera el perfil completo de un docente universitario específico mediante su identificador numérico pasado en la ruta (Path Param).",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Identificador numérico único del docente (Path Param)",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: "Detalle del docente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    docente: { $ref: "#/components/schemas/Docente" },
                    motor_bd: { type: "string", example: "mysql" },
                  },
                },
              },
            },
          },
          404: {
            description: "Docente no encontrado en la base de datos relacional",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Docente con ID 99 no encontrado" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Administración de la base de datos"],
        summary: "Actualizar docente mediante Path Param y Query Params",
        description:
          "Actualiza los datos indicados de un docente. Envíe el ID en la ruta y los campos que desea actualizar como parámetros de consulta; no use body. Debe incluir al menos un campo.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Identificador numérico único del docente",
            schema: { type: "integer", example: 1 },
          },
          ...docenteQueryParameters,
        ],
        responses: {
          200: {
            description: "Docente actualizado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string" },
                    docente: { $ref: "#/components/schemas/Docente" },
                  },
                },
              },
            },
          },
          400: { description: "No se indicaron campos o los datos no son válidos" },
          404: { description: "No existe un docente con ese ID" },
        },
      },
      delete: {
        tags: ["Administración de la base de datos"],
        summary: "Eliminar docente por ID (Path Param)",
        description: "Elimina el registro del docente indicado. No requiere body.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Identificador numérico único del docente",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Docente eliminado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string" },
                    id: { type: "integer", example: 1 },
                  },
                },
              },
            },
          },
          404: { description: "No existe un docente con ese ID" },
        },
      },
    },
    "/api/docentes/buscar": {
      get: {
        tags: ["Docentes UNINPAHU"],
        summary: "Búsqueda por palabra clave (Query Param)",
        description:
          "Endpoint de consulta rápida mediante el parámetro de consulta ?q=... (Query Param) para buscar docentes por coincidencia en cualquier campo.",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Término de búsqueda rápida (Query Param)",
            schema: {
              type: "string",
              example: "Elfar Didier",
            },
          },
        ],
        responses: {
          200: {
            description: "Coincidencias encontradas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 1 },
                    docentes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Docente" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/docentes/agregar": {
      post: {
        tags: ["Administración de la base de datos"],
        summary: "Agregar docente mediante Query Params (Sin Body Params)",
        description:
          "Registra un docente sin body. Nombre y cargo son obligatorios. Programa, facultad, correo, imagen, LinkedIn y perfil completo son opcionales; si se omiten o se envían vacíos, quedan en NULL. No se asignan imágenes automáticas.",
        parameters: docenteQueryParameters.map((parameter) => ({
          ...parameter,
          required: ["nombre", "cargo"].includes(parameter.name),
        })),
        responses: {
          201: {
            description: "Docente insertado exitosamente en la base de datos relacional",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Docente agregado exitosamente a la base de datos relacional" },
                    docente: { $ref: "#/components/schemas/Docente" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/docentes/seed": {
      post: {
        tags: ["Administración de la base de datos"],
        summary: "Sincronizar docentes iniciales (Sin Body Params)",
        description:
          "Sincroniza los registros iniciales de docentes en la base de datos relacional. No requiere parámetros en el body.",
        responses: {
          200: {
            description: "Sembrado exitoso de docentes en la base de datos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Base de datos sincronizada con 6 docentes de UNINPAHU" },
                    total: { type: "integer", example: 6 },
                    motor: { type: "string", example: "postgres" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Administración de la base de datos"],
        summary: "Verificar salud del microservicio y motor de base de datos",
        description:
          "Reporta el estado operativo del microservicio agnóstico en Node.js y la conectividad a la base de datos relacional (MySQL / PostgreSQL).",
        responses: {
          200: {
            description: "Servicio saludable y conectado a base de datos",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Docente: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "ELFAR DIDIER MORANTES SANCHEZ" },
          cargo: { type: "string", example: "Profesor Universitario e Instructor SENA | Arquitecto de Software" },
          programa: { type: "string", example: "Ingeniería de Software" },
          facultad: { type: "string", example: "Facultad de Ingeniería y Tecnologías de la Información (FITI)" },
          correo: { type: "string", example: "emorantessa@uninpahu.edu.co" },
          imagen: { type: "string", example: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" },
          linkedin: { type: "string", example: "https://www.linkedin.com/in/elfar-didier-morantes-s%C3%A1nchez/" },
          perfil_completo: { type: "string", example: "ELFAR DIDIER MORANTES SÁNCHEZ es Ingeniero Electrónico y Magíster en Educación y Elearning..." },
          formacion: { type: "string", example: "Ingeniero Electrónico | Magíster en Educación y Elearning..." },
          created_at: { type: "string", example: "2026-10-03T12:00:00.000Z" },
          updated_at: { type: "string", example: "2026-10-03T12:00:00.000Z" },
        },
      },
    },
  },
};

module.exports = { swaggerDocument };
