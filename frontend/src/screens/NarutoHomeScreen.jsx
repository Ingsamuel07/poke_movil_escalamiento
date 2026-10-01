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
import { useNaruto } from "../context/NarutoContext";
import BottomThumbBar from "../components/BottomThumbBar";
import ApiConfigModal from "../components/ApiConfigModal";

export default function NarutoHomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const {
    character,
    characterList,
    loading,
    loadingList,
    error,
    searchCharacter,
    selectCharacter,
    loadCharacterList,
  } = useNaruto();

  const handleSearch = () => {
    if (name.trim()) {
      searchCharacter(name);
    }
  };

  // Obtener las 3 imágenes a mostrar
  const mainImage = character?.imagen || character?.imagenes?.[0];
  const secondImage = character?.imagenes?.[1] || mainImage;
  const thirdImage = character?.imagenes?.[2] || secondImage || mainImage;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* HEADER CON TÍTULO Y BOTÓN DE CONFIGURACIÓN */}
        <View style={styles.header}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>ANIME HEROES</Text>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>🍃 BD No Relacional (Python & MongoDB Atlas)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.configButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.configButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Busca por personaje o anime (ej. Luffy, Goku)"
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
            <Text style={styles.searchButtonText}>BUSCAR</Text>
          </TouchableOpacity>
        </View>

        {/* SELECTOR DE LOS 10 PERSONAJES DE ANIME EN MONGODB */}
        <View style={styles.chipsSection}>
          <View style={styles.chipsHeader}>
            <Text style={styles.chipsTitle}>
              10 PERSONAJES EN MONGODB ATLAS ({characterList.length}/10):
            </Text>
            {loadingList ? (
              <ActivityIndicator size="small" color="#f97316" />
            ) : (
              <TouchableOpacity onPress={loadCharacterList}>
                <Text style={styles.refreshText}>🔄</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {characterList.map((item) => {
              const isSelected = character?.id === item.id || character?.nombre === item.nombre;
              return (
                <TouchableOpacity
                  key={`anime-${item.id || item.nombre}`}
                  style={[styles.chip, isSelected && styles.activeChip]}
                  onPress={() => {
                    setName(item.nombre);
                    selectCharacter(item);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, isSelected && styles.activeChipText]}
                  >
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ERROR */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* CARGANDO */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#f97316"
            style={styles.loading}
          />
        )}

        {/* IMÁGENES Y DATOS DEL PERSONAJE */}
        {character && !loading && (
          <View style={styles.imagesContainer}>
            {/* NOMBRE DEL PERSONAJE ACTIVO */}
            <View style={styles.currentNameBox}>
              <Text style={styles.currentNameText}>
                {character.nombre?.toUpperCase()}
              </Text>
              <Text style={styles.animeSubtitle}>
                {character.anime || "Anime Oficial"} • {character.rango || "Personaje"}
              </Text>
            </View>

            {/* IMAGEN PRINCIPAL */}
            <View style={styles.mainImageBox}>
              {mainImage ? (
                <Image
                  source={{ uri: mainImage }}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.noImgText}>Sin Imagen</Text>
              )}
            </View>

            {/* DOS MINIATURAS ADICIONALES */}
            <View style={styles.smallImagesContainer}>
              <View style={styles.smallImageBox}>
                {secondImage ? (
                  <Image
                    source={{ uri: secondImage }}
                    style={styles.smallImage}
                    resizeMode="contain"
                  />
                ) : null}
              </View>

              <View style={styles.smallImageBox}>
                {thirdImage ? (
                  <Image
                    source={{ uri: thirdImage }}
                    style={styles.smallImage}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
            </View>

            {/* BOTÓN VER DATOS */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate("NarutoDetails")}
              activeOpacity={0.8}
            >
              <Text style={styles.detailsButtonText}>
                VER DATOS EN BD NO RELACIONAL
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* MODAL PARA CONFIGURAR URLS DE SERVICIOS */}
      <ApiConfigModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpdated={loadCharacterList}
      />

      {/* BARRA INFERIOR DE PESTAÑAS */}
      <BottomThumbBar navigation={navigation} activeRoute="NarutoHome" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },
  badgeBox: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  badgeText: {
    fontSize: 11,
    color: "#065f46",
    fontWeight: "700",
  },
  configButton: {
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  configButtonText: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 14,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: "#ea580c",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    borderRadius: 4,
  },
  searchButton: {
    width: 90,
    height: 48,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 4,
  },
  searchButtonText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  chipsSection: {
    marginBottom: 16,
  },
  chipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chipsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
  },
  refreshText: {
    fontSize: 14,
  },
  chipsScroll: {
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: "#ea580c",
    borderColor: "#ea580c",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  activeChipText: {
    color: "#ffffff",
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
  currentNameBox: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  currentNameText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
  },
  animeSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  mainImageBox: {
    width: "100%",
    height: 220,
    borderWidth: 2,
    borderColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff7ed",
  },
  mainImage: {
    width: "82%",
    height: "82%",
  },
  noImgText: {
    color: "#9ca3af",
  },
  smallImagesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  smallImageBox: {
    width: "48%",
    height: 110,
    borderWidth: 2,
    borderColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7ed",
  },
  smallImage: {
    width: "75%",
    height: "75%",
  },
  detailsButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 6,
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
