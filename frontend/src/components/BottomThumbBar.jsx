import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function BottomThumbBar({ navigation, activeRoute }) {
  const tabs = [
  {
    id: "Home",
    title: "Poké 10",
    badge: "1",
    icon: "⚡",
  },
  {
    id: "Details",
    title: "Poké Datos",
    badge: "2",
    icon: "📊",
  },
  {
    id: "NarutoHome",
    title: "Anime 10",
    badge: "3",
    icon: "🍥",
  },
  {
    id: "NarutoDetails",
    title: "Anime Datos",
    badge: "4",
    icon: "📜",
  },
  {
    id: "DatosDocente",
    title: "Docente",
    badge: "5",
    icon: "👨‍🏫",
  },
];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive =
            activeRoute === tab.id ||
            (tab.id === "DatosDocente" && activeRoute === "DatosDocenteDetalle");
          const isDocenteTab = tab.id === "DatosDocente";
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.thumbButton,
                isActive && styles.activeThumbButton,
                isActive && isDocenteTab && styles.activeDocenteButton,
              ]}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(tab.id);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.buttonText,
                  isActive && styles.activeButtonText,
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
              {isActive && <View style={[styles.activeDot, isDocenteTab && { backgroundColor: "#ffffff" }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1.5,
    borderTopColor: "#e5e7eb",
    paddingBottom: Platform.OS === "ios" ? 18 : 6,
    paddingTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 10,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  thumbButton: {
    flex: 1,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 3,
    backgroundColor: "#f9fafb",
  },
  activeThumbButton: {
    backgroundColor: "#111827",
  },
  activeDocenteButton: {
    backgroundColor: "#ea580c",
  },
  icon: {
    fontSize: 16,
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4b5563",
  },
  activeButtonText: {
    color: "#ffffff",
  },
  activeDot: {
    width: 14,
    height: 3,
    backgroundColor: "#ff7a21",
    borderRadius: 2,
    marginTop: 2,
  },
});
