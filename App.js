import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "./src/constants/colors";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
