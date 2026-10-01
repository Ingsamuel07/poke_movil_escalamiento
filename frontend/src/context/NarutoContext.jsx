import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAnimeCharacter, getAnimeList, seedAnime } from "../services/api";

const NarutoContext = createContext();

export const NarutoProvider = ({ children }) => {
  const [character, setCharacter] = useState(null);
  const [characterList, setCharacterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [dbSource, setDbSource] = useState("BD No Relacional (MongoDB Atlas)");

  // Cargar los 10 personajes de anime desde MongoDB Atlas
  const loadCharacterList = useCallback(async () => {
    try {
      setLoadingList(true);
      setError("");
      const list = await getAnimeList();
      setCharacterList(list);

      // Si no hay seleccionado y la lista tiene elementos, seleccionar el primero (ej. Naruto)
      if (list && list.length > 0 && !character) {
        setCharacter(list[0]);
      }
    } catch (err) {
      console.warn("Aviso al cargar lista no relacional de Anime:", err.message);
    } finally {
      setLoadingList(false);
    }
  }, [character]);

  useEffect(() => {
    loadCharacterList();
  }, [loadCharacterList]);

  const searchCharacter = async (name) => {
    if (!name || !name.trim()) {
      setError("Ingresa el nombre o ID de un personaje de anime");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAnimeCharacter(name);
      const charData = data?.personaje || data;
      setCharacter(charData);

      // Agregar a la lista visible si no está
      if (charData && !characterList.some((c) => c.id === charData.id)) {
        setCharacterList((prev) => [...prev, charData]);
      }
    } catch (err) {
      setError(err.message || "Error al consultar el personaje en la BD no relacional");
    } finally {
      setLoading(false);
    }
  };

  const selectCharacter = (charData) => {
    setCharacter(charData);
    setError("");
  };

  const handleSeedAnime = async () => {
    try {
      setLoadingList(true);
      await seedAnime();
      await loadCharacterList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  return (
    <NarutoContext.Provider
      value={{
        character,
        characterList,
        loading,
        loadingList,
        error,
        dbSource,
        searchCharacter,
        selectCharacter,
        loadCharacterList,
        handleSeedAnime,
      }}
    >
      {children}
    </NarutoContext.Provider>
  );
};

export const useNaruto = () => {
  const context = useContext(NarutoContext);

  if (!context) {
    throw new Error("useNaruto debe utilizarse dentro de NarutoProvider");
  }

  return context;
};
