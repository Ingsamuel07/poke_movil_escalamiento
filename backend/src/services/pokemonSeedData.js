/**
 * 10 Pokémons oficiales para la base de datos relacional
 */
const SEED_POKEMONS = [
  {
    id: 25,
    nombre: "pikachu",
    altura: 4,
    peso: 60,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    species: "mouse-pokemon",
    tipos: ["electric"],
    habilidades: ["static", "lightning-rod"],
    stats: [
      { nombre: "hp", valor: 35 },
      { nombre: "attack", valor: 55 },
      { nombre: "defense", valor: 40 },
      { nombre: "special-attack", valor: 50 },
      { nombre: "special-defense", valor: 50 },
      { nombre: "speed", valor: 90 }
    ],
    movimientos: ["thunder-shock", "quick-attack", "iron-tail", "thunderbolt", "volt-tackle", "electro-ball"]
  },
  {
    id: 6,
    nombre: "charizard",
    altura: 17,
    peso: 905,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    species: "flame-pokemon",
    tipos: ["fire", "flying"],
    habilidades: ["blaze", "solar-power"],
    stats: [
      { nombre: "hp", valor: 78 },
      { nombre: "attack", valor: 84 },
      { nombre: "defense", valor: 78 },
      { nombre: "special-attack", valor: 109 },
      { nombre: "special-defense", valor: 85 },
      { nombre: "speed", valor: 100 }
    ],
    movimientos: ["flamethrower", "fire-blast", "dragon-claw", "air-slash", "flare-blitz", "heat-wave"]
  },
  {
    id: 9,
    nombre: "blastoise",
    altura: 16,
    peso: 855,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    species: "shellfish-pokemon",
    tipos: ["water"],
    habilidades: ["torrent", "rain-dish"],
    stats: [
      { nombre: "hp", valor: 79 },
      { nombre: "attack", valor: 83 },
      { nombre: "defense", valor: 100 },
      { nombre: "special-attack", valor: 85 },
      { nombre: "special-defense", valor: 105 },
      { nombre: "speed", valor: 78 }
    ],
    movimientos: ["hydro-pump", "water-pulse", "skull-bash", "surf", "ice-beam", "protect"]
  },
  {
    id: 3,
    nombre: "venusaur",
    altura: 20,
    peso: 1000,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    species: "seed-pokemon",
    tipos: ["grass", "poison"],
    habilidades: ["overgrow", "chlorophyll"],
    stats: [
      { nombre: "hp", valor: 80 },
      { nombre: "attack", valor: 82 },
      { nombre: "defense", valor: 83 },
      { nombre: "special-attack", valor: 100 },
      { nombre: "special-defense", valor: 100 },
      { nombre: "speed", valor: 80 }
    ],
    movimientos: ["solarbeam", "sludge-bomb", "petal-blizzard", "vine-whip", "sleep-powder", "giga-drain"]
  },
  {
    id: 94,
    nombre: "gengar",
    altura: 15,
    peso: 405,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    species: "shadow-pokemon",
    tipos: ["ghost", "poison"],
    habilidades: ["cursed-body"],
    stats: [
      { nombre: "hp", valor: 60 },
      { nombre: "attack", valor: 65 },
      { nombre: "defense", valor: 60 },
      { nombre: "special-attack", valor: 130 },
      { nombre: "special-defense", valor: 75 },
      { nombre: "speed", valor: 110 }
    ],
    movimientos: ["shadow-ball", "sludge-bomb", "hypnosis", "dream-eater", "dark-pulse", "destiny-bond"]
  },
  {
    id: 150,
    nombre: "mewtwo",
    altura: 20,
    peso: 1220,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    species: "genetic-pokemon",
    tipos: ["psychic"],
    habilidades: ["pressure", "unnerve"],
    stats: [
      { nombre: "hp", valor: 106 },
      { nombre: "attack", valor: 110 },
      { nombre: "defense", valor: 90 },
      { nombre: "special-attack", valor: 154 },
      { nombre: "special-defense", valor: 90 },
      { nombre: "speed", valor: 130 }
    ],
    movimientos: ["psystrike", "psychic", "aura-sphere", "shadow-ball", "recover", "calm-mind"]
  },
  {
    id: 448,
    nombre: "lucario",
    altura: 12,
    peso: 540,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
    species: "aura-pokemon",
    tipos: ["fighting", "steel"],
    habilidades: ["steadfast", "inner-focus", "justified"],
    stats: [
      { nombre: "hp", valor: 70 },
      { nombre: "attack", valor: 110 },
      { nombre: "defense", valor: 70 },
      { nombre: "special-attack", valor: 115 },
      { nombre: "special-defense", valor: 70 },
      { nombre: "speed", valor: 90 }
    ],
    movimientos: ["aura-sphere", "close-combat", "dragon-pulse", "extreme-speed", "flash-cannon", "bone-rush"]
  },
  {
    id: 658,
    nombre: "greninja",
    altura: 15,
    peso: 400,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
    species: "ninja-pokemon",
    tipos: ["water", "dark"],
    habilidades: ["torrent", "protean", "battle-bond"],
    stats: [
      { nombre: "hp", valor: 72 },
      { nombre: "attack", valor: 95 },
      { nombre: "defense", valor: 67 },
      { nombre: "special-attack", valor: 103 },
      { nombre: "special-defense", valor: 71 },
      { nombre: "speed", valor: 122 }
    ],
    movimientos: ["water-shuriken", "night-slash", "hydro-pump", "ice-beam", "shadow-sneak", "aerial-ace"]
  },
  {
    id: 133,
    nombre: "eevee",
    altura: 3,
    peso: 65,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    species: "evolution-pokemon",
    tipos: ["normal"],
    habilidades: ["run-away", "adaptability", "anticipation"],
    stats: [
      { nombre: "hp", valor: 55 },
      { nombre: "attack", valor: 55 },
      { nombre: "defense", valor: 50 },
      { nombre: "special-attack", valor: 45 },
      { nombre: "special-defense", valor: 65 },
      { nombre: "speed", valor: 55 }
    ],
    movimientos: ["quick-attack", "swift", "bite", "take-down", "charm", "double-edge"]
  },
  {
    id: 143,
    nombre: "snorlax",
    altura: 21,
    peso: 4600,
    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
    species: "sleeping-pokemon",
    tipos: ["normal"],
    habilidades: ["immunity", "thick-fat", "gluttony"],
    stats: [
      { nombre: "hp", valor: 160 },
      { nombre: "attack", valor: 110 },
      { nombre: "defense", valor: 65 },
      { nombre: "special-attack", valor: 65 },
      { nombre: "special-defense", valor: 110 },
      { nombre: "speed", valor: 30 }
    ],
    movimientos: ["body-slam", "rest", "snore", "hyper-beam", "crunch", "heavy-slam"]
  }
];

module.exports = {
  SEED_POKEMONS
};
