import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomThumbBar from "../components/BottomThumbBar";
import { getDocentesList } from "../services/api";

export default function DatosDocente({ navigation }) {
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocentes = async (term) => {
    setLoading(true);
    setError("");
    try {
      setDocentes(await getDocentesList(term));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getDocentesList()
      .then((result) => {
        if (active) setDocentes(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>UNINPAHU · FITI</Text>
          <Text style={styles.title}>Docentes</Text>
          <Text style={styles.subtitle}>Conoce a nuestro equipo académico</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Buscar docentes"
            style={styles.searchInput}
            placeholder="Buscar por nombre o programa"
            placeholderTextColor="#788397"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => loadDocentes(search)}
            returnKeyType="search"
          />
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.searchButton}
            onPress={() => loadDocentes(search)}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Equipo docente</Text>
          <TouchableOpacity onPress={() => loadDocentes(search)} accessibilityRole="button">
            <Text style={styles.refresh}>Actualizar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ea580c" style={styles.loading} />
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>No se pudieron cargar los docentes</Text>
            <Text style={styles.message}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadDocentes(search)}>
              <Text style={styles.retryText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        ) : docentes.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.message}>No hay docentes que coincidan con la búsqueda.</Text>
          </View>
        ) : (
          docentes.map((docente) => (
            <TouchableOpacity
              key={docente.id}
              style={styles.teacherCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("DatosDocenteDetalle", { id: docente.id })}
              accessibilityRole="button"
              accessibilityLabel={`Ver perfil de ${docente.nombre}`}
            >
              {docente.imagen ? (
                <Image source={{ uri: docente.imagen }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>{docente.nombre?.charAt(0) || "D"}</Text>
                </View>
              )}
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{docente.nombre}</Text>
                <Text style={styles.role}>{docente.cargo}</Text>
                <Text style={styles.program}>{docente.programa}</Text>
                <Text style={styles.more}>Ver perfil completo →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomThumbBar navigation={navigation} activeRoute="DatosDocente" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 20, paddingBottom: 28 },
  header: { paddingVertical: 16 },
  eyebrow: { color: "#ea580c", fontSize: 12, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: "#111827", fontSize: 30, fontWeight: "800", marginTop: 5 },
  subtitle: { color: "#5b6575", fontSize: 15, marginTop: 5 },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  searchInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#d8dee8",
    borderRadius: 12,
    borderWidth: 1,
    color: "#111827",
    minHeight: 48,
    paddingHorizontal: 14,
  },
  searchButton: {
    alignItems: "center",
    backgroundColor: "#ea580c",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  searchButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  sectionHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { color: "#111827", fontSize: 18, fontWeight: "800" },
  refresh: { color: "#c2410c", fontSize: 14, fontWeight: "700" },
  loading: { marginTop: 32 },
  messageCard: { backgroundColor: "#ffffff", borderRadius: 14, padding: 18 },
  errorTitle: { color: "#b42318", fontSize: 16, fontWeight: "800" },
  message: { color: "#5b6575", fontSize: 14, lineHeight: 21, marginTop: 6 },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ea580c",
    borderRadius: 9,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: { color: "#ffffff", fontWeight: "700" },
  teacherCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e6eaf0",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
  },
  avatar: { backgroundColor: "#e7ebf1", borderRadius: 30, height: 60, width: 60 },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  avatarInitial: { color: "#475467", fontSize: 24, fontWeight: "800" },
  teacherInfo: { flex: 1, marginLeft: 14 },
  teacherName: { color: "#111827", fontSize: 16, fontWeight: "800" },
  role: { color: "#525d6d", fontSize: 13, lineHeight: 18, marginTop: 4 },
  program: { color: "#7a8493", fontSize: 12, marginTop: 5 },
  more: { color: "#c2410c", fontSize: 13, fontWeight: "700", marginTop: 9 },
});