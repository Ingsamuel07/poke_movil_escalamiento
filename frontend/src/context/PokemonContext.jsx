import React, { createContext, useContext, useState } from "react";
import { getPokemon } from "../services/api";

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPokemon = async (name) => {
    if (!name || !name.trim()) {
      setError("Ingresa el nombre de un Pokémon");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getPokemon(name);

      setPokemon(data);
    } catch (err) {
      setPokemon(null);
      setError(err.message || "Error al consultar el Pokémon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        loading,
        error,
        searchPokemon,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error(
      "usePokemon debe utilizarse dentro de PokemonProvider"
    );
  }

  return context;
};