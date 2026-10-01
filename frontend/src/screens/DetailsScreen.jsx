import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";

import { usePokemon } from "../context/PokemonContext";
import BottomThumbBar from "../components/BottomThumbBar";

export default function DetailsScreen({ navigation }) {
  const { pokemon } = usePokemon();

  // Si no hay Pokémon seleccionado
  if (!pokemon) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚡</Text>
          <Text style={styles.emptyText}>
            Selecciona o busca un Pokémon en la pestaña 1
          </Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>← VOLVER A POKÉ FOTOS</Text>
          </TouchableOpacity>
        </View>

        <BottomThumbBar navigation={navigation} activeRoute="Details" />
      </View>
    );
  }

  // Detectar los movimientos
  const rawMoves = pokemon.movimientos || pokemon.moves || [];
  let movimientos = [];
  if (typeof rawMoves === "string") {
    try {
      movimientos = JSON.parse(rawMoves);
    } catch {
      movimientos = [];
    }
  } else if (Array.isArray(rawMoves)) {
    movimientos = rawMoves;
  }

  // Detectar tipos
  const rawTipos = pokemon.tipos || [];
  let tipos = [];
  if (typeof rawTipos === "string") {
    try {
      tipos = JSON.parse(rawTipos);
    } catch {
      tipos = [];
    }
  } else if (Array.isArray(rawTipos)) {
    tipos = rawTipos;
  }

  // Detectar habilidades
  const rawAbil = pokemon.habilidades || [];
  let habilidades = [];
  if (typeof rawAbil === "string") {
    try {
      habilidades = JSON.parse(rawAbil);
    } catch {
      habilidades = [];
    }
  } else if (Array.isArray(rawAbil)) {
    habilidades = rawAbil;
  }

  // Detectar stats
  const rawStats = pokemon.stats || [];
  let stats = [];
  if (typeof rawStats === "string") {
    try {
      stats = JSON.parse(rawStats);
    } catch {
      stats = [];
    }
  } else if (Array.isArray(rawStats)) {
    stats = rawStats;
  }

  return (
    <View style={styles.container}>
      {/* CONTENIDO DESPLAZABLE */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.card}>
          {/* HEADER DEL POKÉMON */}
          {pokemon.imagen ? (
            <Image
              source={{ uri: pokemon.imagen }}
              style={styles.avatar}
              resizeMode="contain"
            />
          ) : null}

          <Text style={styles.title}>
            #{pokemon.id} {(pokemon.nombre || pokemon.name || "POKÉMON").toUpperCase()}
          </Text>
          <Text style={styles.species}>
            Especie: {pokemon.species || "Pokémon oficial"}
          </Text>
          <View style={styles.badgeRelational}>
            <Text style={styles.badgeRelationalText}>💾 Almacenado en BD Relacional</Text>
          </View>

          {/* TIPOS */}
          {tipos.length > 0 && (
            <View style={styles.typesRow}>
              {tipos.map((t, idx) => (
                <View key={`type-${idx}`} style={styles.typeBadge}>
                  <Text style={styles.typeText}>{String(t).toUpperCase()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* INFORMACIÓN DE ALTURA Y PESO */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>ALTURA</Text>
              <Text style={styles.value}>
                {pokemon.altura !== undefined ? `${pokemon.altura / 10} m` : "N/A"}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>PESO</Text>
              <Text style={styles.value}>
                {pokemon.peso !== undefined ? `${pokemon.peso / 10} kg` : "N/A"}
              </Text>
            </View>
          </View>

          {/* HABILIDADES */}
          {habilidades.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>HABILIDADES</Text>
              <View style={styles.tagsContainer}>
                {habilidades.map((h, idx) => (
                  <View key={`hab-${idx}`} style={styles.tagAbility}>
                    <Text style={styles.tagAbilityText}>{String(h).toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ESTADÍSTICAS BASE */}
          {stats.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>ESTADÍSTICAS BASE</Text>
              {stats.map((s, idx) => {
                const statVal = typeof s === "object" ? s.valor : s;
                const statName = typeof s === "object" ? s.nombre : `Stat ${idx + 1}`;
                const pct = Math.min(100, Math.round((Number(statVal) / 160) * 100));
                return (
                  <View key={`stat-${idx}`} style={styles.statRow}>
                    <Text style={styles.statName}>{statName.toUpperCase()}</Text>
                    <View style={styles.statBarBg}>
                      <View style={[styles.statBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.statVal}>{statVal}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* MOVIMIENTOS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              MOVIMIENTOS ({movimientos.length})
            </Text>

            {movimientos.length > 0 ? (
              <View style={styles.movesGrid}>
                {movimientos.map((item, index) => (
                  <View key={index} style={styles.moveItem}>
                    <Text style={styles.moveText}>
                      • {typeof item === "string" ? item.toUpperCase() : item?.name?.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noMoves}>
                No hay movimientos registrados
              </Text>
            )}
          </View>

          {/* BOTÓN REGRESAR */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← VOLVER A POKÉ FOTOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <BottomThumbBar navigation={navigation} activeRoute="Details" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 25,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#374151",
  },
  homeButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    borderWidth: 2,
    borderColor: "#111",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  species: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  badgeRelational: {
    backgroundColor: "#e0e7ff",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 14,
  },
  badgeRelationalText: {
    fontSize: 11,
    color: "#3730a3",
    fontWeight: "700",
  },
  typesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
  },
  typeBadge: {
    backgroundColor: "#ff7a21",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginHorizontal: 4,
  },
  typeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#111",
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#f9fafb",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  sectionBox: {
    marginTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagAbility: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  tagAbilityText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  statName: {
    width: 90,
    fontSize: 10,
    fontWeight: "700",
    color: "#4b5563",
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  statVal: {
    width: 32,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    color: "#111827",
  },
  movesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moveItem: {
    width: "50%",
    paddingVertical: 3,
  },
  moveText: {
    fontSize: 12,
    color: "#374151",
  },
  noMoves: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  backButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 18,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});