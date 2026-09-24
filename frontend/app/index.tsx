import React from "react";

import { PokemonProvider } from "../src/context/PokemonContext";
import AppNavigator from "../src/navigation/AppNavigator";

export default function App() {
  return (
    <PokemonProvider>
      <AppNavigator />
    </PokemonProvider>
  );
}