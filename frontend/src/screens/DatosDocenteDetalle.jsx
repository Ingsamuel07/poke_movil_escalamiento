import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomThumbBar from "../components/BottomThumbBar";
import { getDocente } from "../services/api";

const profileFields = [
  ["Perfil", "perfil_completo"],
];

export default function DatosDocenteDetalle({ navigation, route }) {
  const id = route?.params?.id;
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadedId, setLoadedId] = useState(null);

  useEffect(() => {
    let active = true;
    getDocente(id)
      .then((result) => {
        if (active) {
          setDocente(result);
          setError("");
          setLoadedId(id);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setLoadedId(id);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Volver a docentes</Text>
      </TouchableOpacity>
      {docente?.imagen && !error ? (
        <Image source={{ uri: docente.imagen }} style={styles.avatar} />
      ) : null}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      >
        {loading || loadedId !== id ? (
          <ActivityIndicator size="large" color="#ea580c" style={styles.loading} />
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>No se pudo cargar el perfil</Text>
            <Text style={styles.bodyText}>{error}</Text>
          </View>
        ) : !docente ? (
          <View style={styles.messageCard}>
            <Text style={styles.bodyText}>No se encontró el docente solicitado.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.name}>{docente.nombre}</Text>
            <Text style={styles.role}>{docente.cargo}</Text>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Información de contacto</Text>
              <InfoRow label="Correo" value={docente.correo} />
              <InfoRow label="LinkedIn" value={docente.linkedin} />
            </View>

            {profileFields.map(([title, field]) =>
              docente[field] ? (
                <ProfileSection key={field} title={title} value={docente[field]} />
              ) : null
            )}
          </View>
        )}
      </ScrollView>
      <BottomThumbBar navigation={navigation} activeRoute="DatosDocenteDetalle" />
    </View>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.bodyText}>{value}</Text>
    </View>
  );
}

function ProfileSection({ title, value }) {
  return (
    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.bodyText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 },
  backButton: { alignSelf: "flex-start", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backText: { color: "#c2410c", fontSize: 15, fontWeight: "700" },
  loading: { marginTop: 48 },
  messageCard: { backgroundColor: "#ffffff", borderRadius: 14, marginTop: 16, padding: 18 },
  errorTitle: { color: "#b42318", fontSize: 16, fontWeight: "800", marginBottom: 6 },
  card: { backgroundColor: "#ffffff", borderRadius: 18, marginTop: 8, padding: 20 },
  avatar: { alignSelf: "center", backgroundColor: "#e7ebf1", borderRadius: 48, height: 96, marginBottom: 12, width: 96 },
  name: { color: "#111827", fontSize: 24, fontWeight: "800", textAlign: "center" },
  role: { color: "#525d6d", fontSize: 15, lineHeight: 22, marginTop: 6, textAlign: "center" },
  contactSection: { borderTopColor: "#e6eaf0", borderTopWidth: 1, marginTop: 22, paddingTop: 18 },
  sectionTitle: { color: "#111827", fontSize: 17, fontWeight: "800", marginBottom: 10 },
  infoRow: { marginBottom: 12 },
  label: { color: "#788397", fontSize: 12, fontWeight: "700", marginBottom: 3, textTransform: "uppercase" },
  bodyText: { color: "#465163", fontSize: 14, lineHeight: 22 },
  profileSection: { borderTopColor: "#e6eaf0", borderTopWidth: 1, marginTop: 18, paddingTop: 18 },
});