import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  getApiUrls,
  setCustomApiUrls,
  resetApiUrls,
  testMicroservicesConnection,
  seedPokemons,
  seedAnime,
  seedDocentes,
} from "../services/api";

export default function ApiConfigModal({ visible, onClose, onUpdated }) {
  const currentUrls = getApiUrls();
  const [nodeUrl, setNodeUrl] = useState(currentUrls.pokemonApiUrl);
  const [pythonUrl, setPythonUrl] = useState(currentUrls.animeApiUrl);
  const [docentesUrl, setDocentesUrl] = useState(currentUrls.docentesApiUrl || "");
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSave = () => {
    setCustomApiUrls({
      pokemonUrl: nodeUrl.trim(),
      animeUrl: pythonUrl.trim(),
      docentesUrl: docentesUrl.trim(),
    });
    setStatusMsg("✅ URLs guardadas correctamente");
    if (onUpdated) onUpdated();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleReset = () => {
    const def = resetApiUrls();
    setNodeUrl(def.pokemonApiUrl);
    setPythonUrl(def.animeApiUrl);
    setDocentesUrl(def.docentesApiUrl);
    setTestResults(null);
    setStatusMsg("Restaurado a valores por defecto");
    if (onUpdated) onUpdated();
  };

  const handleTest = async () => {
    setTesting(true);
    setStatusMsg("");
    setCustomApiUrls({
      pokemonUrl: nodeUrl.trim(),
      animeUrl: pythonUrl.trim(),
      docentesUrl: docentesUrl.trim(),
    });
    const res = await testMicroservicesConnection();
    setTestResults(res);
    setTesting(false);
  };

  const handleSeedBoth = async () => {
    setSeeding(true);
    setStatusMsg("Sembrando registros en bases de datos en la nube...");
    try {
      await Promise.all([seedPokemons(), seedAnime(), seedDocentes()]);
      setStatusMsg("✅ Datos iniciales sincronizados en los tres microservicios");
      if (onUpdated) onUpdated();
    } catch (e) {
      setStatusMsg(`Aviso: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>⚙️ Configuración de Microservicios</Text>
            <Text style={styles.subtitle}>
              Configura las URLs públicas desplegadas en Render, Railway o tu red local.
            </Text>

            {/* MICROSERVICIO NODE POKEMON */}
            <View style={styles.group}>
              <Text style={styles.label}>
                1. Microservicio Pokémon (Node.js & BD Relacional):
              </Text>
              <TextInput
                style={styles.input}
                value={nodeUrl}
                onChangeText={setNodeUrl}
                placeholder="https://tu-servicio-node.onrender.com/api"
                autoCapitalize="none"
              />
              <Text style={styles.hint}>Swagger docs en: {nodeUrl.replace(/\/api$/, "")}/api-docs</Text>
            </View>

            {/* MICROSERVICIO PYTHON ANIME */}
            <View style={styles.group}>
              <Text style={styles.label}>
                2. Microservicio Anime (Python & BD No Relacional):
              </Text>
              <TextInput
                style={styles.input}
                value={pythonUrl}
                onChangeText={setPythonUrl}
                placeholder="https://tu-servicio-python.onrender.com/api"
                autoCapitalize="none"
              />
              <Text style={styles.hint}>Swagger docs en: {pythonUrl.replace(/\/api$/, "")}/docs</Text>
            </View>

            {/* MICROSERVICIO DOCENTES UNINPAHU */}
            <View style={styles.group}>
              <Text style={styles.label}>
                3. Microservicio Docentes (Node.js Agnóstico & BD Nube):
              </Text>
              <TextInput
                style={styles.input}
                value={docentesUrl}
                onChangeText={setDocentesUrl}
                placeholder="https://tu-servicio-docentes.onrender.com/api"
                autoCapitalize="none"
              />
              <Text style={styles.hint}>Swagger docs en: {docentesUrl.replace(/\/api$/, "")}/api-docs</Text>
            </View>

            {/* RESULTADOS DE PRUEBA */}
            {testResults && (
              <View style={styles.testBox}>
                <Text style={styles.testTitle}>Resultado de conexión:</Text>
                <Text style={[styles.testItem, { color: testResults.pokemon?.ok ? "#10b981" : "#ef4444" }]}>
                  {testResults.pokemon?.ok ? "🟢" : "🔴"} Node.js Pokémon:{" "}
                  {testResults.pokemon?.ok ? "Conectado OK" : "Sin respuesta"}
                </Text>
                <Text style={[styles.testItem, { color: testResults.anime?.ok ? "#10b981" : "#ef4444" }]}>
                  {testResults.anime?.ok ? "🟢" : "🔴"} Python Anime:{" "}
                  {testResults.anime?.ok ? "Conectado OK" : "Sin respuesta"}
                </Text>
                <Text style={[styles.testItem, { color: testResults.docentes?.ok ? "#10b981" : "#ef4444" }]}>
                  {testResults.docentes?.ok ? "🟢" : "🔴"} Node.js Docentes (Agnóstico):{" "}
                  {testResults.docentes?.ok ? "Conectado OK" : "Sin respuesta"}
                </Text>
              </View>
            )}

            {statusMsg ? <Text style={styles.statusMsg}>{statusMsg}</Text> : null}

            {/* BOTONES DE ACCIÓN */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnTest]}
                onPress={handleTest}
                disabled={testing}
              >
                {testing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnText}>PROBAR CONEXIÓN</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnSeed]}
                onPress={handleSeedBoth}
                disabled={seeding}
              >
                {seeding ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnText}>SINCRONIZAR DATOS INICIALES</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={handleSave}
              >
                <Text style={styles.btnText}>GUARDAR Y APLICAR</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.btnSmall, styles.btnReset]}
                  onPress={handleReset}
                >
                  <Text style={styles.btnSmallText}>Restaurar Local</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnSmall, styles.btnClose]}
                  onPress={onClose}
                >
                  <Text style={styles.btnSmallText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center",
  },
  group: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  hint: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 3,
  },
  testBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  testTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
  },
  testItem: {
    fontSize: 12,
    fontWeight: "600",
    marginVertical: 2,
  },
  statusMsg: {
    fontSize: 12,
    textAlign: "center",
    color: "#059669",
    fontWeight: "600",
    marginBottom: 10,
  },
  actions: {
    marginTop: 6,
  },
  btn: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  btnTest: {
    backgroundColor: "#4f46e5",
  },
  btnSeed: {
    backgroundColor: "#059669",
  },
  btnSave: {
    backgroundColor: "#111827",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  btnSmall: {
    flex: 1,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  btnReset: {
    backgroundColor: "#e5e7eb",
  },
  btnClose: {
    backgroundColor: "#fee2e2",
  },
  btnSmallText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
});
