import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomThumbBar from "../components/BottomThumbBar";
import { addDocente, deleteDocente, getDocentesList, updateDocente } from "../services/api";

const docenteFields = [
  ["nombre", "Nombre completo", false],
  ["cargo", "Cargo", false],
  ["correo", "Correo", false],
  ["imagen", "URL de imagen", false],
  ["linkedin", "LinkedIn", false],
  ["perfil_completo", "Perfil completo", true],
];

const requiredDocenteFields = new Set(["nombre", "cargo"]);
const emptyDocente = Object.fromEntries(docenteFields.map(([key]) => [key, ""]));

export default function DatosDocente({ navigation }) {
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingDocente, setEditingDocente] = useState(null);
  const [formData, setFormData] = useState(emptyDocente);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const openForm = (docente = null) => {
    setEditingDocente(docente);
    setFormData(
      docente
        ? Object.fromEntries(docenteFields.map(([key]) => [key, docente[key] || ""]))
        : { ...emptyDocente }
    );
    setFormError("");
    setFormVisible(true);
  };

  const saveDocente = async () => {
    if (!formData.nombre.trim() || !formData.cargo.trim()) {
      setFormError("Completa el nombre y el cargo.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      if (editingDocente) {
        await updateDocente(editingDocente.id, formData);
      } else {
        await addDocente(formData);
      }
      setFormVisible(false);
      await loadDocentes(search);
    } catch (requestError) {
      setFormError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeDocente = async (docente) => {
    setError("");
    try {
      await deleteDocente(docente.id);
      await loadDocentes(search);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const confirmDelete = (docente) => {
    const onConfirm = () => removeDocente(docente);
    if (Platform.OS === "web") {
      if (window.confirm(`¿Eliminar el registro de ${docente.nombre}?`)) onConfirm();
      return;
    }
    Alert.alert("Eliminar docente", `¿Eliminar el registro de ${docente.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: onConfirm },
    ]);
  };

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
            placeholder="Buscar por nombre o cargo"
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
          <View style={styles.headingActions}>
            <TouchableOpacity onPress={() => loadDocentes(search)} accessibilityRole="button">
              <Text style={styles.refresh}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.addButton}
              onPress={() => openForm()}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
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
            <View key={docente.id} style={styles.teacherCard}>
              <TouchableOpacity
                style={styles.teacherMain}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("DatosDocenteDetalle", { id: docente.id })}
                accessibilityRole="button"
                accessibilityLabel={`Consultar perfil de ${docente.nombre}`}
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
                  <Text style={styles.more}>Ver perfil completo →</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.teacherActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.editButton}
                  onPress={() => openForm(docente)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(docente)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={formVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingDocente ? "Editar docente" : "Agregar docente"}
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
              {docenteFields.map(([key, label, multiline]) => (
                <View key={key} style={styles.formField}>
                  <Text style={styles.formLabel}>
                    {label}{requiredDocenteFields.has(key) ? " *" : " (opcional)"}
                  </Text>
                  <TextInput
                    accessibilityLabel={label}
                    style={[styles.formInput, multiline && styles.multilineInput]}
                    value={formData[key]}
                    onChangeText={(value) => setFormData((current) => ({ ...current, [key]: value }))}
                    placeholder={label}
                    placeholderTextColor="#788397"
                    autoCapitalize={key === "correo" || key === "linkedin" || key === "imagen" ? "none" : "sentences"}
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                  />
                </View>
              ))}
            </ScrollView>
            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formActionButton, styles.cancelButton]}
                onPress={() => setFormVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formActionButton, styles.saveButton]}
                onPress={saveDocente}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  headingActions: { alignItems: "center", flexDirection: "row", gap: 14 },
  refresh: { color: "#c2410c", fontSize: 14, fontWeight: "700" },
  addButton: { backgroundColor: "#ea580c", borderRadius: 9, paddingHorizontal: 12, paddingVertical: 8 },
  addButtonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
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
    backgroundColor: "#ffffff",
    borderColor: "#e6eaf0",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  teacherMain: { alignItems: "center", flexDirection: "row" },
  avatar: { backgroundColor: "#e7ebf1", borderRadius: 30, height: 60, width: 60 },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  avatarInitial: { color: "#475467", fontSize: 24, fontWeight: "800" },
  teacherInfo: { flex: 1, marginLeft: 14 },
  teacherName: { color: "#111827", fontSize: 16, fontWeight: "800" },
  role: { color: "#525d6d", fontSize: 13, lineHeight: 18, marginTop: 4 },
  more: { color: "#c2410c", fontSize: 13, fontWeight: "700", marginTop: 9 },
  teacherActions: { flexDirection: "row", justifyContent: "flex-end", gap: 9, marginTop: 12 },
  editButton: { borderColor: "#c2410c", borderRadius: 8, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 7 },
  editButtonText: { color: "#c2410c", fontSize: 13, fontWeight: "700" },
  deleteButton: { backgroundColor: "#fff1f0", borderRadius: 8, paddingHorizontal: 13, paddingVertical: 7 },
  deleteButtonText: { color: "#b42318", fontSize: 13, fontWeight: "700" },
  modalOverlay: { backgroundColor: "rgba(17,24,39,0.55)", flex: 1, justifyContent: "center", padding: 16 },
  formCard: { backgroundColor: "#ffffff", borderRadius: 18, maxHeight: "92%", padding: 20 },
  formTitle: { color: "#111827", fontSize: 22, fontWeight: "800", marginBottom: 15, textAlign: "center" },
  formField: { marginBottom: 12 },
  formLabel: { color: "#465163", fontSize: 13, fontWeight: "700", marginBottom: 5 },
  formInput: { backgroundColor: "#ffffff", borderColor: "#d8dee8", borderRadius: 10, borderWidth: 1, color: "#111827", minHeight: 44, paddingHorizontal: 12 },
  multilineInput: { minHeight: 82, paddingTop: 10 },
  formError: { color: "#b42318", fontSize: 13, marginTop: 10 },
  formActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 16 },
  formActionButton: { alignItems: "center", borderRadius: 9, justifyContent: "center", minWidth: 100, paddingHorizontal: 16, paddingVertical: 11 },
  cancelButton: { backgroundColor: "#f1f3f6" },
  cancelButtonText: { color: "#465163", fontWeight: "700" },
  saveButton: { backgroundColor: "#ea580c" },
  saveButtonText: { color: "#ffffff", fontWeight: "700" },
});