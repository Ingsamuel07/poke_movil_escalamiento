import React from "react";

import { PokemonProvider } from "../src/context/PokemonContext";
import { NarutoProvider } from "../src/context/NarutoContext";
import AppNavigator from "../src/navigation/AppNavigator";

export default function App() {
  return (
    <PokemonProvider>
      <NarutoProvider>
        <AppNavigator />
      </NarutoProvider>
    </PokemonProvider>
  );
}