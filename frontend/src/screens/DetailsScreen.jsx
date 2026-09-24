import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

import { usePokemon } from "../context/PokemonContext";

export default function DetailsScreen({ navigation }) {
  const { pokemon } = usePokemon();

  // Si no hay Pokémon seleccionado
  if (!pokemon) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Primero busca un Pokémon
        </Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>
            ← VOLVER A HOME
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Detectar los movimientos
  const movimientos =
    pokemon.movimientos ||
    pokemon.moves ||
    [];

  return (
    <View style={styles.container}>

      {/* CONTENIDO DESPLAZABLE */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
      >

        <View style={styles.card}>

          {/* NOMBRE */}
          <Text style={styles.title}>
            {pokemon.nombre ||
              pokemon.name ||
              "POKÉMON"}
          </Text>

          {/* INFORMACIÓN */}
          <View style={styles.infoContainer}>

            <View style={styles.infoBox}>
              <Text style={styles.label}>
                ALTURA
              </Text>

              <Text style={styles.value}>
                {pokemon.altura ??
                  pokemon.height ??
                  "No disponible"}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>
                PESO
              </Text>

              <Text style={styles.value}>
                {pokemon.peso ??
                  pokemon.weight ??
                  "No disponible"}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>
                ESPECIE
              </Text>

              <Text style={styles.value}>
                {pokemon.species ||
                  "No disponible"}
              </Text>
            </View>

          </View>

          {/* MOVIMIENTOS */}
          <Text style={styles.sectionTitle}>
            MOVIMIENTOS
          </Text>

          {movimientos.length > 0 ? (

            <View style={styles.movesContainer}>

              {movimientos.map((move, index) => {

                const moveName =
                  typeof move === "string"
                    ? move
                    : move?.name ||
                      move?.nombre ||
                      move?.move?.name ||
                      move?.move?.nombre ||
                      "Movimiento";

                return (
                  <View
                    key={`${moveName}-${index}`}
                    style={styles.moveBox}
                  >
                    <Text
                      style={styles.move}
                      numberOfLines={2}
                    >
                      {moveName}
                    </Text>
                  </View>
                );
              })}

            </View>

          ) : (

            <View style={styles.noMoves}>
              <Text style={styles.noMovesText}>
                No hay movimientos disponibles
              </Text>
            </View>

          )}

        </View>

      </ScrollView>

      {/* BOTÓN FIJO ARRIBA */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>
            ← VOLVER A HOME
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  /* CONTENEDOR PRINCIPAL */
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f4f6f8",
  },

  /* SCROLL */
  scroll: {
    flex: 1,

    ...(Platform.OS === "web"
      ? {
          overflowY: "scroll",
        }
      : {}),
  },

  scrollContent: {
    padding: 15,
    paddingTop: 85,
    paddingBottom: 30,
  },

  /* TARJETA */
  card: {
    width: "100%",
    alignSelf: "center",

    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#d9dee5",

    borderRadius: 16,

    padding: 20,
  },

  /* NOMBRE */
  title: {
    fontSize: 28,
    fontWeight: "bold",

    textAlign: "center",

    marginBottom: 25,

    color: "#111827",
  },

  /* INFORMACIÓN */
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },

  infoBox: {
    flex: 1,
    minWidth: 100,

    backgroundColor: "#f8fafc",

    borderRadius: 10,

    padding: 12,

    alignItems: "center",
  },

  label: {
    fontSize: 11,
    fontWeight: "bold",

    color: "#6b7280",

    marginBottom: 5,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",

    color: "#111827",

    textAlign: "center",
  },

  /* TÍTULO MOVIMIENTOS */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",

    marginTop: 30,
    marginBottom: 15,

    color: "#111827",
  },

  /* MOVIMIENTOS */
  movesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "flex-start",

    gap: 8,

    width: "100%",
  },

  /* 8 POR FILA */
  moveBox: {
    width: "11.8%",

    minHeight: 42,

    backgroundColor: "#eef2f7",

    borderRadius: 8,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,
    paddingVertical: 6,
  },

  move: {
    fontSize: 11,
    fontWeight: "600",

    color: "#374151",

    textAlign: "center",
  },

  /* SIN MOVIMIENTOS */
  noMoves: {
    width: "100%",

    padding: 20,

    borderRadius: 10,

    backgroundColor: "#f8fafc",

    alignItems: "center",
  },

  noMovesText: {
    fontSize: 14,
    color: "#6b7280",
  },

  /* BOTÓN FIJO ARRIBA */
  buttonContainer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: 70,

    backgroundColor: "#f4f6f8",

    paddingHorizontal: 15,
    paddingVertical: 9,

    justifyContent: "center",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#d9dee5",

    zIndex: 10,
    elevation: 10,
  },

  /* BOTÓN HOME */
  homeButton: {
    width: "100%",
    maxWidth: 500,

    height: 52,

    borderRadius: 12,

    backgroundColor: "#111827",

    justifyContent: "center",
    alignItems: "center",
  },

  homeButtonText: {
    color: "#ffffff",

    fontSize: 16,
    fontWeight: "bold",
  },

  /* SIN POKÉMON */
  emptyContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    padding: 20,

    backgroundColor: "#f4f6f8",
  },

  emptyText: {
    fontSize: 18,

    marginBottom: 20,

    color: "#374151",
  },

});