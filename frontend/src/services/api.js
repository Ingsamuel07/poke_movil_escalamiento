const API_URL = "http://localhost:3000/api";

export const getPokemon = async (name) => {
  try {
    const response = await fetch(
      `${API_URL}/pokemon/${name.toLowerCase().trim()}`
    );

    if (!response.ok) {
      throw new Error("No se encontró el Pokémon");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};