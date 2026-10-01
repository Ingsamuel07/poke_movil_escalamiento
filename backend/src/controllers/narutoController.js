const narutoService = require("../services/narutoService");

const obtenerPersonaje = async (req, res) => {
  try {
    const { nombre } = req.params;

    const personaje = await narutoService.getNarutoCharacter(nombre);

    res.status(200).json({
      mensaje: "Personaje encontrado correctamente",
      personaje: personaje,
    });

  } catch (error) {
    console.error("Error en narutoController:", error.message);

    const isNotFound =
      error.message === "Personaje de Naruto no encontrado" ||
      error.message?.toLowerCase().includes("no se recibió");

    res.status(isNotFound ? 404 : 500).json({
      mensaje: error.message || "Error al buscar el personaje de Naruto",
      error: error.message,
    });
  }
};

const listarPopulares = async (req, res) => {
  try {
    const personajes = narutoService.getPopularCharacters();
    res.status(200).json({
      mensaje: "Personajes populares de Naruto",
      personajes: personajes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar personajes",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerPersonaje,
  listarPopulares,
};
