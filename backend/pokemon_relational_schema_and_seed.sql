-- ========================================================
-- SCRIPT SQL: ESQUEMA Y CARGA DE 10 POKÉMON EN BASE RELACIONAL
-- Compatible con PostgreSQL y MySQL
-- ========================================================

-- Crear tabla pokemon si no existe
CREATE TABLE IF NOT EXISTS pokemon (
  id INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  altura INT DEFAULT NULL,
  peso INT DEFAULT NULL,
  imagen TEXT DEFAULT NULL,
  species VARCHAR(100) DEFAULT NULL,
  tipos TEXT DEFAULT NULL,
  habilidades TEXT DEFAULT NULL,
  stats TEXT DEFAULT NULL,
  movimientos TEXT DEFAULT NULL
);

-- Limpiar datos previos si se desea reiniciar
-- TRUNCATE TABLE pokemon;

-- Inserción de los 10 Pokémon requeridos
INSERT INTO pokemon (id, nombre, altura, peso, imagen, species, tipos, habilidades, stats, movimientos) VALUES
(25, 'pikachu', 4, 60, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 
 'mouse-pokemon', 
 '["electric"]', 
 '["static", "lightning-rod"]', 
 '[{"nombre":"hp","valor":35},{"nombre":"attack","valor":55},{"nombre":"defense","valor":40},{"nombre":"special-attack","valor":50},{"nombre":"special-defense","valor":50},{"nombre":"speed","valor":90}]', 
 '["thunder-shock", "quick-attack", "iron-tail", "thunderbolt", "volt-tackle", "electro-ball"]'),

(6, 'charizard', 17, 905, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', 
 'flame-pokemon', 
 '["fire", "flying"]', 
 '["blaze", "solar-power"]', 
 '[{"nombre":"hp","valor":78},{"nombre":"attack","valor":84},{"nombre":"defense","valor":78},{"nombre":"special-attack","valor":109},{"nombre":"special-defense","valor":85},{"nombre":"speed","valor":100}]', 
 '["flamethrower", "fire-blast", "dragon-claw", "air-slash", "flare-blitz", "heat-wave"]'),

(9, 'blastoise', 16, 855, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', 
 'shellfish-pokemon', 
 '["water"]', 
 '["torrent", "rain-dish"]', 
 '[{"nombre":"hp","valor":79},{"nombre":"attack","valor":83},{"nombre":"defense","valor":100},{"nombre":"special-attack","valor":85},{"nombre":"special-defense","valor":105},{"nombre":"speed","valor":78}]', 
 '["hydro-pump", "water-pulse", "skull-bash", "surf", "ice-beam", "protect"]'),

(3, 'venusaur', 20, 1000, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', 
 'seed-pokemon', 
 '["grass", "poison"]', 
 '["overgrow", "chlorophyll"]', 
 '[{"nombre":"hp","valor":80},{"nombre":"attack","valor":82},{"nombre":"defense","valor":83},{"nombre":"special-attack","valor":100},{"nombre":"special-defense","valor":100},{"nombre":"speed","valor":80}]', 
 '["solarbeam", "sludge-bomb", "petal-blizzard", "vine-whip", "sleep-powder", "giga-drain"]'),

(94, 'gengar', 15, 405, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', 
 'shadow-pokemon', 
 '["ghost", "poison"]', 
 '["cursed-body"]', 
 '[{"nombre":"hp","valor":60},{"nombre":"attack","valor":65},{"nombre":"defense","valor":60},{"nombre":"special-attack","valor":130},{"nombre":"special-defense","valor":75},{"nombre":"speed","valor":110}]', 
 '["shadow-ball", "sludge-bomb", "hypnosis", "dream-eater", "dark-pulse", "destiny-bond"]'),

(150, 'mewtwo', 20, 1220, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', 
 'genetic-pokemon', 
 '["psychic"]', 
 '["pressure", "unnerve"]', 
 '[{"nombre":"hp","valor":106},{"nombre":"attack","valor":110},{"nombre":"defense","valor":90},{"nombre":"special-attack","valor":154},{"nombre":"special-defense","valor":90},{"nombre":"speed","valor":130}]', 
 '["psystrike", "psychic", "aura-sphere", "shadow-ball", "recover", "calm-mind"]'),

(448, 'lucario', 12, 540, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png', 
 'aura-pokemon', 
 '["fighting", "steel"]', 
 '["steadfast", "inner-focus", "justified"]', 
 '[{"nombre":"hp","valor":70},{"nombre":"attack","valor":110},{"nombre":"defense","valor":70},{"nombre":"special-attack","valor":115},{"nombre":"special-defense","valor":70},{"nombre":"speed","valor":90}]', 
 '["aura-sphere", "close-combat", "dragon-pulse", "extreme-speed", "flash-cannon", "bone-rush"]'),

(658, 'greninja', 15, 400, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png', 
 'ninja-pokemon', 
 '["water", "dark"]', 
 '["torrent", "protean", "battle-bond"]', 
 '[{"nombre":"hp","valor":72},{"nombre":"attack","valor":95},{"nombre":"defense","valor":67},{"nombre":"special-attack","valor":103},{"nombre":"special-defense","valor":71},{"nombre":"speed","valor":122}]', 
 '["water-shuriken", "night-slash", "hydro-pump", "ice-beam", "shadow-sneak", "aerial-ace"]'),

(133, 'eevee', 3, 65, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', 
 'evolution-pokemon', 
 '["normal"]', 
 '["run-away", "adaptability", "anticipation"]', 
 '[{"nombre":"hp","valor":55},{"nombre":"attack","valor":55},{"nombre":"defense","valor":50},{"nombre":"special-attack","valor":45},{"nombre":"special-defense","valor":65},{"nombre":"speed","valor":55}]', 
 '["quick-attack", "swift", "bite", "take-down", "charm", "double-edge"]'),

(143, 'snorlax', 21, 4600, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', 
 'sleeping-pokemon', 
 '["normal"]', 
 '["immunity", "thick-fat", "gluttony"]', 
 '[{"nombre":"hp","valor":160},{"nombre":"attack","valor":110},{"nombre":"defense","valor":65},{"nombre":"special-attack","valor":65},{"nombre":"special-defense","valor":110},{"nombre":"speed","valor":30}]', 
 '["body-slam", "rest", "snore", "hyper-beam", "crunch", "heavy-slam"]');
