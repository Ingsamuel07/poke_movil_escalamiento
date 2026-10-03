import React from "react";

import { NavigationContainer } from "expo-router/react-navigation";

import { PokemonProvider } from "./context/PokemonContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <PokemonProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PokemonProvider>
  );
}