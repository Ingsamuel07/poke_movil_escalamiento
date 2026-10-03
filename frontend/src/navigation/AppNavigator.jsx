import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import NarutoHomeScreen from "../screens/NarutoHomeScreen";
import NarutoDetailsScreen from "../screens/NarutoDetailsScreen";
import DatosDocente from "../screens/DatosDocente";
import DatosDocenteDetalle from "../screens/DatosDocenteDetalle";

export default function AppNavigator() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.location) {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("docente-detalle")) {
        return "DatosDocenteDetalle";
      }
      if (hash.includes("docente")) return "DatosDocente";
      if (hash.includes("naruto")) return "NarutoHome";
    }
    return "Home";
  });
  const [routeParams, setRouteParams] = useState({});

  const navigation = {
    navigate: (routeName, params = {}) => {
      if (routeName) {
        setRouteParams(params);
        setCurrentRoute(routeName);
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.location.hash = routeName.toLowerCase();
        }
      }
    },
    goBack: () => {
      if (currentRoute === "DatosDocenteDetalle") {
        setCurrentRoute("DatosDocente");
      } else if (currentRoute === "Details") {
        setCurrentRoute("Home");
      } else if (currentRoute === "NarutoDetails") {
        setCurrentRoute("NarutoHome");
      } else {
        setCurrentRoute("Home");
      }
    },
  };

  return (
    <View style={styles.container}>
      {currentRoute === "Home" && <HomeScreen navigation={navigation} />}
      {currentRoute === "Details" && <DetailsScreen navigation={navigation} />}
      {currentRoute === "NarutoHome" && <NarutoHomeScreen navigation={navigation} />}
      {currentRoute === "NarutoDetails" && <NarutoDetailsScreen navigation={navigation} />}
      {currentRoute === "DatosDocente" && (
        <DatosDocente navigation={navigation} route={{ params: routeParams }} />
      )}
      {currentRoute === "DatosDocenteDetalle" && (
        <DatosDocenteDetalle navigation={navigation} route={{ params: routeParams }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});