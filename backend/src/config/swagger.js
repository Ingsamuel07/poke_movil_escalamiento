const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Microservicio Pokémon (Node.js & Base de Datos Relacional)",
    version: "1.0.0",
    description:
      "Microservicio en Node.js/Express conectado a una base de datos relacional en la nube (Neon PostgreSQL) para consultar y gestionar 10 Pokémon oficiales.",
    contact: {
      name: "Samuel",
    },
  },
  servers: [
    {
      url: "/",
      description: "Servidor actual (Producción Render / Local)",
    },
    {
      url: "https://poke-movil-escalamiento.onrender.com",
      description: "Servidor en la nube (Render)",
    },
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
  ],
  tags: [
    {
      name: "Pokémon",
      description: "Operaciones con los 10 Pokémon en la base de datos relacional Neon PostgreSQL",
    },
    {
      name: "General",
      description: "Verificación de estado y salud del microservicio",
    },
  ],
  paths: {
    "/api/pokemon": {
      get: {
        tags: ["Pokémon"],
        summary: "Obtener la lista de los 10 Pokémon desde la base de datos relacional",
        description: "Retorna todos los Pokémon almacenados en la base de datos relacional (Neon PostgreSQL). Permite filtrar por nombre o ID.",
        parameters: [
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description: "Término de búsqueda opcional por nombre o ID (ej. 'pikachu', '25')",
          },
        ],
        responses: {
          200: {
            description: "Lista de Pokémon obtenida exitosamente desde la base de datos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Lista de Pokémon obtenida correctamente desde la base de datos relacional" },
                    total: { type: "integer", example: 10 },
                    pokemons: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pokemon" },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error interno del servidor o de la base de datos",
          },
        },
      },
      post: {
        tags: ["Pokémon"],
        summary: "Crear o actualizar un Pokémon en la base de datos relacional",
        description: "Inserta un nuevo Pokémon o actualiza sus datos en la tabla relacional de Neon PostgreSQL.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PokemonInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Pokémon guardado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Pokémon guardado exitosamente en la base de datos relacional" },
                    pokemon: { $ref: "#/components/schemas/Pokemon" },
                  },
                },
              },
            },
          },
          400: { description: "Datos requeridos faltantes (id o nombre)" },
          500: { description: "Error al guardar el registro en la base de datos" },
        },
      },
    },
    "/api/pokemon/{nombre}": {
      get: {
        tags: ["Pokémon"],
        summary: "Obtener un Pokémon específico por nombre o ID",
        description: "Busca un Pokémon por su nombre (ej. 'charizard') o por su número de Pokédex (ej. 6) en la base de datos relacional.",
        parameters: [
          {
            in: "path",
            name: "nombre",
            required: true,
            schema: { type: "string" },
            description: "Nombre o ID del Pokémon (ej. 'pikachu' o '25')",
            example: "pikachu",
          },
        ],
        responses: {
          200: {
            description: "Pokémon encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Pokémon encontrado correctamente en la base de datos relacional" },
                    pokemon: { $ref: "#/components/schemas/Pokemon" },
                  },
                },
              },
            },
          },
          404: { description: "Pokémon no encontrado en la base de datos" },
          500: { description: "Error del servidor" },
        },
      },
    },
    "/api/pokemon/seed": {
      post: {
        tags: ["Pokémon"],
        summary: "Poblar o restablecer los 10 Pokémon oficiales en Neon PostgreSQL",
        description: "Inserta o reinicia la lista oficial de los 10 Pokémon con sus estadísticas completas en la base de datos relacional en la nube.",
        responses: {
          200: {
            description: "10 Pokémon sembrados exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensaje: { type: "string", example: "Se han sembrado exitosamente los 10 Pokémon en la base de datos relacional" },
                    total: { type: "integer", example: 10 },
                    pokemons: {
                      type: "array",
                      items: { type: "string" },
                      example: ["pikachu", "charizard", "blastoise", "venusaur", "gengar", "mewtwo", "lucario", "greninja", "eevee", "snorlax"],
                    },
                  },
                },
              },
            },
          },
          500: { description: "Error al sembrar en la base de datos" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["General"],
        summary: "Verificación de salud del microservicio",
        responses: {
          200: {
            description: "Servicio activo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "healthy" },
                    timestamp: { type: "string", example: "2026-10-01T21:30:00.000Z" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/": {
      get: {
        tags: ["General"],
        summary: "Información raíz del microservicio",
        responses: {
          200: {
            description: "Metadatos y enlaces rápidos",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pokemon: {
        type: "object",
        properties: {
          id: { type: "integer", example: 25 },
          nombre: { type: "string", example: "pikachu" },
          altura: { type: "integer", example: 4, description: "Altura en decímetros" },
          peso: { type: "integer", example: 60, description: "Peso en hectogramos" },
          imagen: {
            type: "string",
            example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
          },
          species: { type: "string", example: "mouse-pokemon" },
          tipos: {
            type: "array",
            items: { type: "string" },
            example: ["electric"],
          },
          habilidades: {
            type: "array",
            items: { type: "string" },
            example: ["static", "lightning-rod"],
          },
          stats: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nombre: { type: "string", example: "speed" },
                valor: { type: "integer", example: 90 },
              },
            },
          },
          movimientos: {
            type: "array",
            items: { type: "string" },
            example: ["thunder-shock", "quick-attack", "iron-tail", "thunderbolt"],
          },
        },
      },
      PokemonInput: {
        type: "object",
        required: ["id", "nombre"],
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "bulbasaur" },
          altura: { type: "integer", example: 7 },
          peso: { type: "integer", example: 69 },
          imagen: { type: "string", example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" },
          species: { type: "string", example: "seed-pokemon" },
          tipos: { type: "array", items: { type: "string" }, example: ["grass", "poison"] },
          habilidades: { type: "array", items: { type: "string" }, example: ["overgrow"] },
          stats: {
            type: "array",
            items: { type: "object" },
            example: [{ nombre: "hp", valor: 45 }, { nombre: "attack", valor: 49 }],
          },
          movimientos: { type: "array", items: { type: "string" }, example: ["tackle", "vine-whip"] },
        },
      },
    },
  },
};

function setupSwagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "Pokémon API - Swagger UI",
      customJsStr: `
        document.documentElement.setAttribute('translate', 'no');
        document.documentElement.classList.add('notranslate');
        if (document.body) document.body.classList.add('notranslate');
        const meta = document.createElement('meta');
        meta.name = 'google';
        meta.content = 'notranslate';
        document.head.appendChild(meta);
      `,
      customCss: `
        .opblock-summary-method, .opblock-summary-path {
          font-family: monospace !important;
          font-weight: 700 !important;
        }
      `,
      swaggerOptions: {
        docExpansion: "list",
        filter: true,
      },
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });
}

module.exports = {
  setupSwagger,
  swaggerDocument,
};
