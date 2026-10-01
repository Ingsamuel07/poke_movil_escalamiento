import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import NarutoHomeScreen from "../screens/NarutoHomeScreen";
import NarutoDetailsScreen from "../screens/NarutoDetailsScreen";

export default function AppNavigator() {
  const [currentRoute, setCurrentRoute] = useState("Home");

  const navigation = {
    navigate: (routeName) => {
      if (routeName) {
        setCurrentRoute(routeName);
      }
    },
    goBack: () => {
      setCurrentRoute("Home");
    },
  };

  return (
    <View style={styles.container}>
      {currentRoute === "Home" && <HomeScreen navigation={navigation} />}
      {currentRoute === "Details" && <DetailsScreen navigation={navigation} />}
      {currentRoute === "NarutoHome" && <NarutoHomeScreen navigation={navigation} />}
      {currentRoute === "NarutoDetails" && <NarutoDetailsScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});