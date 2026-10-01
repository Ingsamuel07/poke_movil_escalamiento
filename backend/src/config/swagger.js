const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Microservicio Pokémon (Node.js & Base de Datos Relacional)",
      version: "1.0.0",
      description:
        "Microservicio en Node.js/Express conectado a una base de datos relacional en la nube para gestionar y consultar 10 Pokémon.",
      contact: {
        name: "Samuel",
      },
    },
    servers: [
      {
        url: "/",
        description: "Servidor actual (Local / Render / Railway)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    components: {
      schemas: {
        Pokemon: {
          type: "object",
          properties: {
            id: { type: "integer", example: 25 },
            nombre: { type: "string", example: "pikachu" },
            altura: { type: "integer", example: 4 },
            peso: { type: "integer", example: 60 },
            imagen: {
              type: "string",
              example:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
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
              example: ["thunder-shock", "quick-attack", "iron-tail"],
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
            stats: { type: "array", items: { type: "object" }, example: [{ nombre: "hp", valor: 45 }] },
            movimientos: { type: "array", items: { type: "string" }, example: ["tackle", "vine-whip"] }
          }
        },
        GenericResponse: {
          type: "object",
          properties: {
            mensaje: { type: "string", example: "Operación completada" },
            total: { type: "integer", example: 10 },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customSiteTitle: "Pokémon API Swagger Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  }));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });
}

module.exports = {
  setupSwagger,
};
