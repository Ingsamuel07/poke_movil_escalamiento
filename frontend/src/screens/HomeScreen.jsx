import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { usePokemon } from "../context/PokemonContext";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");

  const { pokemon, loading, error, searchPokemon } = usePokemon();

  const handleSearch = () => {
    searchPokemon(name);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* TÍTULO */}
        <Text style={styles.title}>POKÉMON</Text>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Busca un Pokémon"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              BUSCAR
            </Text>
          </TouchableOpacity>
        </View>

        {/* ERROR */}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        {/* CARGANDO */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#ff7a21"
            style={styles.loading}
          />
        )}

        {/* IMÁGENES */}
        {pokemon && !loading && (
          <View style={styles.imagesContainer}>

            {/* IMAGEN PRINCIPAL */}
            <View style={styles.mainImageBox}>
              <Image
                source={{ uri: pokemon.imagen }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>

            {/* DOS IMÁGENES SECUNDARIAS */}
            <View style={styles.smallImagesContainer}>

              <View style={styles.smallImageBox}>
                <Image
                  source={{ uri: pokemon.imagen }}
                  style={styles.smallImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.smallImageBox}>
                <Image
                  source={{ uri: pokemon.imagen }}
                  style={styles.smallImage}
                  resizeMode="contain"
                />
              </View>

            </View>

            {/* BOTÓN VER DATOS */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate("Details")}
              activeOpacity={0.8}
            >
              <Text style={styles.detailsButtonText}>
                VER DATOS
              </Text>
            </TouchableOpacity>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    color: "#111",
  },

  searchContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: "#111",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111",
  },

  searchButton: {
    width: 100,
    height: 48,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  searchButtonText: {
    fontWeight: "bold",
    color: "#f7f1f1",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },

  loading: {
    marginTop: 20,
  },

  imagesContainer: {
    width: "100%",
    alignItems: "center",
  },

  /* IMAGEN PRINCIPAL */
  mainImageBox: {
    width: "100%",
    height: 210,
    borderWidth: 2,
    borderColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  mainImage: {
    width: "80%",
    height: "80%",
  },

  /* IMÁGENES SECUNDARIAS */
  smallImagesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  smallImageBox: {
    width: "48%",
    height: 115,
    borderWidth: 2,
    borderColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  smallImage: {
    width: "80%",
    height: "80%",
  },

  /* BOTÓN VER DATOS */
  detailsButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 10,
  },

  detailsButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#f1ebeb",
  },
});