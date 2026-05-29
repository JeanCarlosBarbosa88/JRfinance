import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/colors";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>JRfinance</Text>
      <Text style={styles.subtitle}>Gerencie suas finanças</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryButtonText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.accent,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 60,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
