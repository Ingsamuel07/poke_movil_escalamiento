const express = require("express");
const router = express.Router();

const { obtenerPokemon } = require("../controllers/pokemonController");

router.get("/pokemon/:nombre", obtenerPokemon);

module.exports = router;
