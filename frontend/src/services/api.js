import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Obtener IP o host dinámico para entorno local en Expo
 */
const getDefaultHost = () => {
  if (Platform.OS === "web") {
    return "localhost";
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  return hostUri ? hostUri.split(":")[0] : "localhost";
};

const DEFAULT_HOST = getDefaultHost();
const IS_LOCAL_WEB =
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const IS_LOCAL_NATIVE = __DEV__ && Platform.OS !== "web";

const LOCAL_POKEMON_URL = IS_LOCAL_WEB
  ? "http://localhost:3000/api"
  : `http://${DEFAULT_HOST}:3000/api`;
const LOCAL_ANIME_URL = IS_LOCAL_WEB
  ? "http://localhost:8000/api"
  : `http://${DEFAULT_HOST}:8000/api`;

// URLs oficiales desplegadas en Render
const DEPLOYED_POKEMON_URL = "https://poke-movil-escalamiento.onrender.com/api";
const DEPLOYED_ANIME_URL = "https://anime-backend-python.onrender.com/api";
const DEPLOYED_DOCENTES_URL =
  "https://poke-movil-escalamiento-docente-1.onrender.com/api";

let config = {
  pokemonApiUrl: IS_LOCAL_WEB || IS_LOCAL_NATIVE ? LOCAL_POKEMON_URL : DEPLOYED_POKEMON_URL,
  animeApiUrl: IS_LOCAL_WEB || IS_LOCAL_NATIVE ? LOCAL_ANIME_URL : DEPLOYED_ANIME_URL,
  docentesApiUrl: DEPLOYED_DOCENTES_URL,
};

/**
 * Permite cambiar dinámicamente las URLs de los microservicios
 * (por ejemplo al desplegar en Render / Railway)
 */
export const setCustomApiUrls = ({ pokemonUrl, animeUrl, docentesUrl }) => {
  if (pokemonUrl) {
    config.pokemonApiUrl = pokemonUrl.replace(/\/+$/, "");
  }
  if (animeUrl) {
    config.animeApiUrl = animeUrl.replace(/\/+$/, "");
  }
  if (docentesUrl) {
    config.docentesApiUrl = docentesUrl.replace(/\/+$/, "");
  }
};

export const getApiUrls = () => ({ ...config });

export const resetApiUrls = () => {
  config = {
    pokemonApiUrl: IS_LOCAL_WEB || IS_LOCAL_NATIVE ? LOCAL_POKEMON_URL : DEPLOYED_POKEMON_URL,
    animeApiUrl: IS_LOCAL_WEB || IS_LOCAL_NATIVE ? LOCAL_ANIME_URL : DEPLOYED_ANIME_URL,
    docentesApiUrl: DEPLOYED_DOCENTES_URL,
  };
  return getApiUrls();
};

/* ========================================================
   1. MICROSERVICIO POKÉMON (Node.js & BD Relacional)
   ======================================================== */

/**
 * Obtiene los 10 Pokémon almacenados en la base de datos relacional
 */
export const getPokemonList = async (search = "") => {
  try {
    const url = search
      ? `${config.pokemonApiUrl}/pokemon?search=${encodeURIComponent(search.trim())}`
      : `${config.pokemonApiUrl}/pokemon`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.mensaje || "Error al obtener lista de Pokémon");
    }

    return data.pokemons || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.warn("Aviso al consultar microservicio Pokémon (lista):", error.message);
    throw error;
  }
};

/**
 * Consulta un Pokémon por ID o nombre en la base de datos relacional
 */
export const getPokemon = async (nameOrId) => {
  try {
    const term = String(nameOrId).toLowerCase().trim();
    const response = await fetch(`${config.pokemonApiUrl}/pokemon/${encodeURIComponent(term)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.mensaje || data?.error || "No se encontró el Pokémon");
    }

    return data.pokemon || data;
  } catch (error) {
    throw error;
  }
};

/**
 * Siembra los 10 Pokémon oficiales en la BD relacional
 */
export const seedPokemons = async () => {
  try {
    const response = await fetch(`${config.pokemonApiUrl}/pokemon/seed`, {
      method: "POST",
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/* ========================================================
   2. MICROSERVICIO ANIME (Python FastAPI & BD No Relacional)
   ======================================================== */

/**
 * Obtiene los 10 personajes de anime almacenados en MongoDB Atlas
 */
export const getAnimeList = async (search = "") => {
  try {
    const query = search ? `?search=${encodeURIComponent(search.trim())}` : "";
    const response = await fetch(`${config.animeApiUrl}/anime${query}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.mensaje || "Error al obtener lista de personajes de anime");
    }

    return data.personajes || (Array.isArray(data) ? data : []);
  } catch (error) {
    // Si falla la ruta /anime, intentar compatibilidad /naruto
    try {
      const narutoRes = await fetch(`${config.animeApiUrl}/naruto`);
      if (narutoRes.ok) {
        const narutoData = await narutoRes.json();
        return narutoData.personajes || [];
      }
    } catch {
      // Ignorar fallback
    }
    console.warn("Aviso al consultar microservicio Anime (lista):", error.message);
    throw error;
  }
};

/**
 * Consulta un personaje de anime por ID o nombre en la base no relacional
 */
export const getAnimeCharacter = async (nameOrId) => {
  const query = String(nameOrId).trim();
  try {
    const response = await fetch(`${config.animeApiUrl}/anime/${encodeURIComponent(query)}`);

    if (response.ok) {
      const data = await response.json();
      return data.personaje || data;
    }

    // Probar compatibilidad con /naruto
    const narutoRes = await fetch(`${config.animeApiUrl}/naruto/${encodeURIComponent(query)}`);
    if (narutoRes.ok) {
      const narutoData = await narutoRes.json();
      return narutoData.personaje || narutoData;
    }

    const errData = await response.json().catch(() => null);
    throw new Error(errData?.detail || errData?.mensaje || "Personaje de anime no encontrado");
  } catch (err) {
    throw err;
  }
};

/**
 * Método de compatibilidad para pantallas existentes
 */
export const getNarutoCharacter = async (name) => {
  return getAnimeCharacter(name);
};

/**
 * Siembra los 10 personajes oficiales en MongoDB Atlas
 */
export const seedAnime = async () => {
  try {
    const response = await fetch(`${config.animeApiUrl}/anime/seed`, {
      method: "POST",
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/* ========================================================
   3. MICROSERVICIO DOCENTES UNINPAHU (Node.js Agnóstico)
   ======================================================== */

/**
 * Consulta el microservicio configurado y, en desarrollo, intenta el servicio local.
 */
const requestDocentes = async (path, options = {}) => {
  const configuredUrl = (config.docentesApiUrl || DEPLOYED_DOCENTES_URL).replace(/\/+$/, "");
  let response;
  try {
    response = await fetch(`${configuredUrl}${path}`, {
      signal: AbortSignal.timeout(15000),
      ...options,
    });
  } catch (error) {
    throw new Error(
      `No se pudo conectar con el microservicio de docentes en ${configuredUrl}: ${error.message}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("El microservicio de docentes devolvió una respuesta no válida.");
  }
  if (!response.ok) {
    throw new Error(
      data?.detalle || data?.error || data?.mensaje || `Error HTTP ${response.status}`
    );
  }
  return data;
};

/**
 * Obtiene docentes utilizando Query Params (?search=...&programa=...)
 */
export const getDocentesList = async (search = "", programa = "") => {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (programa.trim()) params.set("programa", programa.trim());
  const query = params.toString();
  const data = await requestDocentes(`/docentes${query ? `?${query}` : ""}`);
  return data.docentes;
};

/**
 * Consulta un docente específico mediante Path Param (/docentes/:id)
 */
export const getDocente = async (id) => {
  const data = await requestDocentes(`/docentes/${encodeURIComponent(id)}`);
  return data.docente;
};

/**
 * Búsqueda de docentes mediante Query Param (/docentes/buscar?q=...)
 */
export const searchDocentes = async (query) => {
  const data = await requestDocentes(`/docentes/buscar?q=${encodeURIComponent(query.trim())}`);
  return data.docentes;
};

/**
 * Agregar un docente mediante Query Params, sin enviar body
 */
export const addDocente = async (docenteData) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(docenteData)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const data = await requestDocentes(`/docentes/agregar?${params}`, { method: "POST" });
  return data.docente;
};

/**
 * Actualizar datos de un docente por Path Param y Query Params, sin body.
 */
export const updateDocente = async (id, docenteData) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(docenteData)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const query = params.toString();
  const data = await requestDocentes(
    `/docentes/${encodeURIComponent(id)}${query ? `?${query}` : ""}`,
    { method: "PUT" }
  );
  return data.docente;
};

/**
 * Eliminar un docente por Path Param.
 */
export const deleteDocente = async (id) => {
  return requestDocentes(`/docentes/${encodeURIComponent(id)}`, { method: "DELETE" });
};

/**
 * Sincronizar docentes iniciales en la base de datos relacional
 */
export const seedDocentes = async () => {
  return requestDocentes("/docentes/seed", { method: "POST" });
};

/**
 * Comprobar estado de conexión con los tres microservicios
 */
export const testMicroservicesConnection = async () => {
  const results = {
    pokemon: { ok: false, url: config.pokemonApiUrl, error: null },
    anime: { ok: false, url: config.animeApiUrl, error: null },
    docentes: { ok: false, url: config.docentesApiUrl, error: null },
  };

  try {
    const pRes = await fetch(`${config.pokemonApiUrl}/pokemon`, { signal: AbortSignal.timeout(4000) });
    results.pokemon.ok = pRes.ok;
  } catch (e) {
    results.pokemon.error = e.message;
  }

  try {
    const aRes = await fetch(`${config.animeApiUrl}/anime`, { signal: AbortSignal.timeout(4000) });
    results.anime.ok = aRes.ok;
  } catch (e) {
    results.anime.error = e.message;
  }

  try {
    const dRes = await fetch(`${config.docentesApiUrl}/docentes`, { signal: AbortSignal.timeout(10000) });
    results.docentes.ok = dRes.ok;
  } catch (e) {
    results.docentes.error = e.message;
  }

  return results;
};