import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNaruto } from "../context/NarutoContext";
import BottomThumbBar from "../components/BottomThumbBar";

export default function NarutoDetailsScreen({ navigation }) {
  const { character } = useNaruto();

  if (!character) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍥</Text>
          <Text style={styles.emptyTitle}>Sin personaje seleccionado</Text>
          <Text style={styles.emptyText}>
            Ve a la pestaña de Anime Fotos y selecciona un personaje para ver sus datos aquí.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("NarutoHome")}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← IR A ANIME FOTOS</Text>
          </TouchableOpacity>
        </View>

        <BottomThumbBar navigation={navigation} activeRoute="NarutoDetails" />
      </View>
    );
  }

  const jutsus = Array.isArray(character.jutsus) ? character.jutsus : [];
  const naturalezas = Array.isArray(character.naturalezas) ? character.naturalezas : [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.card}>
          {/* FOTO MINIATURA Y NOMBRE */}
          {character.imagen ? (
            <Image
              source={{ uri: character.imagen }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          ) : null}

          <Text style={styles.title}>{character.nombre || "PERSONAJE"}</Text>
          <Text style={styles.animeTag}>{character.anime || "Anime Oficial"}</Text>

          <View style={styles.badgeMongo}>
            <Text style={styles.badgeMongoText}>🍃 Almacenado en MongoDB Atlas (NoSQL)</Text>
          </View>

          {/* GRID DE DATOS PRINCIPALES */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>CLAN / ORIGEN</Text>
              <Text style={styles.value} numberOfLines={2}>
                {character.clan || "Desconocido"}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>ROL / RANGO</Text>
              <Text style={styles.value} numberOfLines={2}>
                {character.rango || "Guerrero"}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>ALDEA / CIUDAD</Text>
              <Text style={styles.value} numberOfLines={2}>
                {character.aldea || "Desconocida"}
              </Text>
            </View>
          </View>

          {/* DESCRIPCIÓN */}
          {character.descripcion ? (
            <View style={styles.descBox}>
              <Text style={styles.descTitle}>BIOGRAFÍA / PERFIL</Text>
              <Text style={styles.descText}>{character.descripcion}</Text>
            </View>
          ) : null}

          {/* ELEMENTOS O NATURALEZAS */}
          {naturalezas.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>ELEMENTOS / PODERES</Text>
              <View style={styles.tagsContainer}>
                {naturalezas.map((nat, idx) => (
                  <View key={`nat-${idx}`} style={styles.tagChakra}>
                    <Text style={styles.tagChakraText}>{nat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* HABILIDADES / JUTSUS */}
          {jutsus.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>
                TÉCNICAS Y HABILIDADES ({jutsus.length})
              </Text>
              <View style={styles.jutsusList}>
                {jutsus.map((j, idx) => (
                  <View key={`jutsu-${idx}`} style={styles.jutsuItem}>
                    <Text style={styles.jutsuBullet}>⚡</Text>
                    <Text style={styles.jutsuText}>{j}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* FAMILIA Y AFILIACIONES */}
          {character.familia ? (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>AFILIACIONES / RELACIONES</Text>
              <Text style={styles.familyText}>{character.familia}</Text>
            </View>
          ) : null}

          {/* BOTÓN REGRESAR */}
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={() => navigation.navigate("NarutoHome")}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonBottomText}>← VOLVER A ANIME FOTOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <BottomThumbBar navigation={navigation} activeRoute="NarutoDetails" />
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
    padding: 24,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
  card: {
    borderWidth: 2,
    borderColor: "#ea580c",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  avatarImage: {
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
  animeTag: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ea580c",
    textAlign: "center",
    marginTop: 2,
  },
  badgeMongo: {
    backgroundColor: "#d1fae5",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginVertical: 10,
  },
  badgeMongoText: {
    fontSize: 11,
    color: "#065f46",
    fontWeight: "700",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  infoBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
    padding: 8,
    marginHorizontal: 3,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#fff7ed",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#9a3412",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 3,
    textAlign: "center",
  },
  descBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  descTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#374151",
  },
  sectionBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChakra: {
    backgroundColor: "#fed7aa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  tagChakraText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#9a3412",
  },
  jutsusList: {
    marginTop: 2,
  },
  jutsuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  jutsuBullet: {
    fontSize: 10,
    marginRight: 6,
  },
  jutsuText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  familyText: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 16,
    fontStyle: "italic",
  },
  backButtonBottom: {
    backgroundColor: "#ea580c",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 18,
  },
  backButtonBottomText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
