try {
  require("dotenv").config();
} catch (e) {
  // En producción (Render / Railway), las variables de entorno son inyectadas por el sistema
}
const express = require("express");
const cors = require("cors");
const { setupSwagger } = require("./config/swagger");
const pokemonRoutes = require("./routes/pokemonRoutes");
const narutoRoutes = require("./routes/narutoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de Swagger UI en /api-docs
setupSwagger(app);

// Rutas de API
app.use("/api", pokemonRoutes);
app.use("/api", narutoRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ruta raíz para verificación del microservicio
 *     responses:
 *       200:
 *         description: Servicio funcionando
 */
app.get("/", (req, res) => {
  res.json({
    nombre: "Microservicio Pokémon (Node.js & Base de Datos Relacional)",
    estado: "Activo",
    documentacion_swagger: "/api-docs",
    endpoints: {
      listar_pokemons: "/api/pokemon",
      buscar_pokemon: "/api/pokemon/:nombre",
      sembrar_10_pokemons: "/api/pokemon/seed",
    },
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck para Render / Railway
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Servidor Pokémon (Node.js) corriendo en puerto: ${PORT}`);
  console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
  console.log(`=======================================================`);
});

module.exports = app;