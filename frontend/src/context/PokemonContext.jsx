import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPokemon, getPokemonList, seedPokemons } from "../services/api";

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemon, setPokemon] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [dbSource, setDbSource] = useState("BD Relacional (Nube)");

  // Cargar los 10 Pokémon almacenados en la base de datos relacional
  const loadPokemonList = useCallback(async () => {
    try {
      setLoadingList(true);
      setError("");
      const list = await getPokemonList();
      setPokemonList(list);

      // Si no hay seleccionado y la lista tiene elementos, seleccionar el primero (ej. Pikachu)
      if (list && list.length > 0 && !pokemon) {
        setPokemon(list[0]);
      }
    } catch (err) {
      console.warn("Aviso al cargar lista relacional de Pokémon:", err.message);
    } finally {
      setLoadingList(false);
    }
  }, [pokemon]);

  useEffect(() => {
    loadPokemonList();
  }, [loadPokemonList]);

  const searchPokemon = async (name) => {
    if (!name || !name.trim()) {
      setError("Ingresa el nombre o ID de un Pokémon");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getPokemon(name);
      const pokeData = data?.pokemon || data;
      setPokemon(pokeData);

      // Si no estaba en la lista visible, agregarlo
      if (pokeData && !pokemonList.some((p) => p.id === pokeData.id)) {
        setPokemonList((prev) => [...prev, pokeData]);
      }
    } catch (err) {
      setError(err.message || "Error al consultar el Pokémon en la BD relacional");
    } finally {
      setLoading(false);
    }
  };

  const selectPokemon = (selectedPoke) => {
    setPokemon(selectedPoke);
    setError("");
  };

  const handleSeedPokemons = async () => {
    try {
      setLoadingList(true);
      await seedPokemons();
      await loadPokemonList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        pokemonList,
        loading,
        loadingList,
        error,
        dbSource,
        searchPokemon,
        selectPokemon,
        loadPokemonList,
        handleSeedPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error("usePokemon debe utilizarse dentro de PokemonProvider");
  }

  return context;
};