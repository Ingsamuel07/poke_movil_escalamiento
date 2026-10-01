const pokemonService = require("../services/pokemonService");

const listarPokemons = async (req, res) => {
  try {
    const { search } = req.query;
    const pokemons = await pokemonService.getAllPokemons(search);
    res.status(200).json({
      mensaje: "Lista de Pokémon obtenida correctamente desde la base de datos relacional",
      total: pokemons.length,
      pokemons: pokemons,
    });
  } catch (error) {
    console.error("Error en listarPokemons:", error.message);
    res.status(500).json({
      mensaje: "Error al consultar los Pokémon de la base de datos",
      error: error.message,
    });
  }
};

const obtenerPokemon = async (req, res) => {
  try {
    const { nombre } = req.params;
    const pokemon = await pokemonService.getPokemon(nombre);

    res.status(200).json({
      mensaje: "Pokémon encontrado correctamente en la base de datos relacional",
      pokemon: pokemon,
    });
  } catch (error) {
    console.error("Error en obtenerPokemon:", error.message);

    const isNotFound =
      error.message === "Pokémon no encontrado en la base de datos" ||
      error.message?.toLowerCase().includes("no se recibió");

    res.status(isNotFound ? 404 : 500).json({
      mensaje: error.message || "Error al buscar el Pokémon",
      error: error.message,
    });
  }
};

const crearPokemon = async (req, res) => {
  try {
    const data = req.body;
    if (!data.id || !data.nombre) {
      return res.status(400).json({
        mensaje: "Los campos 'id' y 'nombre' son obligatorios",
      });
    }

    const nuevoPokemon = await pokemonService.createPokemon(data);
    res.status(201).json({
      mensaje: "Pokémon guardado exitosamente en la base de datos relacional",
      pokemon: nuevoPokemon,
    });
  } catch (error) {
    console.error("Error en crearPokemon:", error.message);
    res.status(500).json({
      mensaje: "Error al guardar el Pokémon",
      error: error.message,
    });
  }
};

const poblarPokemons = async (req, res) => {
  try {
    const resultado = await pokemonService.seedPokemons();
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en poblarPokemons:", error.message);
    res.status(500).json({
      mensaje: "Error al sembrar los 10 Pokémon en la base de datos relacional",
      error: error.message,
    });
  }
};

module.exports = {
  listarPokemons,
  obtenerPokemon,
  crearPokemon,
  poblarPokemons,
};