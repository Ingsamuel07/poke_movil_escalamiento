const db = require("../config/db");

const getPokemon = async (pokemon) => {
  // Primera consulta: información principal del Pokémon
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
  );

  if (!response.ok) {
    throw new Error("Pokémon no encontrado");
  }

  const data = await response.json();

  // Segunda consulta: información de species
  const speciesResponse = await fetch(data.species.url);

  if (!speciesResponse.ok) {
    throw new Error("No se pudo obtener la especie del Pokémon");
  }

  const speciesData = await speciesResponse.json();

  const pokemonData = {
    id: data.id,

    nombre: data.name,

    altura: data.height,

    peso: data.weight,

    imagen:
      data.sprites.other["official-artwork"].front_default,

    tipos: data.types.map((item) => item.type.name),

    habilidades: data.abilities.map(
      (item) => item.ability.name
    ),

    stats: data.stats.map((item) => ({
      nombre: item.stat.name,
      valor: item.base_stat,
    })),

    species: speciesData.name,

    moves: data.moves.map((item) => item.move.name),
  };

  // Guardar Pokémon en MySQL
  await db.execute(
    `
    INSERT INTO pokemon (
      id,
      nombre,
      altura,
      peso,
      imagen,
      species,
      movimientos
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      altura = VALUES(altura),
      peso = VALUES(peso),
      imagen = VALUES(imagen),
      species = VALUES(species)
      movimientos = VALUES(movimientos)
    `,
    [
      pokemonData.id,
      pokemonData.nombre,
      pokemonData.altura,
      pokemonData.peso,
      pokemonData.imagen,
      pokemonData.species,
    ]
  );

  return pokemonData;
};

module.exports = {
  getPokemon,
};