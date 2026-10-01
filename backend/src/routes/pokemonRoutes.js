const express = require("express");
const router = express.Router();
const {
  listarPokemons,
  obtenerPokemon,
  crearPokemon,
  poblarPokemons,
} = require("../controllers/pokemonController");

/**
 * @swagger
 * tags:
 *   name: Pokémon
 *   description: Endpoints para gestionar los 10 Pokémon almacenados en la base de datos relacional
 */

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Obtener la lista de los 10 Pokémon desde la base de datos relacional
 *     tags: [Pokémon]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda opcional por nombre o ID
 *     responses:
 *       200:
 *         description: Lista de Pokémon obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Lista de Pokémon obtenida correctamente desde la base de datos relacional
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 *       500:
 *         description: Error en el servidor o en la base de datos
 */
router.get("/pokemon", listarPokemons);

/**
 * @swagger
 * /api/pokemon/seed:
 *   post:
 *     summary: Poblar o reiniciar los 10 Pokémon oficiales en la base de datos relacional
 *     tags: [Pokémon]
 *     responses:
 *       200:
 *         description: 10 Pokémon sembrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       500:
 *         description: Error al poblar la base de datos
 */
router.post("/pokemon/seed", poblarPokemons);

/**
 * @swagger
 * /api/pokemon/{nombre}:
 *   get:
 *     summary: Obtener un Pokémon específico por su nombre o ID
 *     tags: [Pokémon]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre (ej. pikachu) o ID numérico (ej. 25)
 *     responses:
 *       200:
 *         description: Pokémon encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Pokémon encontrado correctamente en la base de datos relacional
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/pokemon/:nombre", obtenerPokemon);

/**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Crear o actualizar un Pokémon en la base de datos relacional
 *     tags: [Pokémon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PokemonInput'
 *     responses:
 *       201:
 *         description: Pokémon guardado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Pokémon guardado exitosamente en la base de datos relacional
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Datos requeridos faltantes
 *       500:
 *         description: Error del servidor
 */
router.post("/pokemon", crearPokemon);

module.exports = router;
