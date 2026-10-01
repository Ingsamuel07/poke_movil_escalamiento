import React from "react";
import { createStackNavigator } from "expo-router/js-stack";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import NarutoHomeScreen from "../screens/NarutoHomeScreen";
import NarutoDetailsScreen from "../screens/NarutoDetailsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
      />

      <Stack.Screen
        name="NarutoHome"
        component={NarutoHomeScreen}
      />

      <Stack.Screen
        name="NarutoDetails"
        component={NarutoDetailsScreen}
      />
    </Stack.Navigator>
  );
}