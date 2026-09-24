const pokemonService = require("../services/pokemonService");

const obtenerPokemon = async (req, res) => {
  try {
    const { nombre } = req.params;

    const pokemon = await pokemonService.getPokemon(nombre);

    res.json(pokemon);
  } catch (error) {
    res.status(404).json({
      mensaje: "No se encontró el Pokémon",
    });
  }
};

module.exports = {
  obtenerPokemon,
};
