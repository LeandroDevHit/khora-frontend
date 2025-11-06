import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Importar o componente Icone para a marca de verificação
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 🚀 Logo/Inicial 'K' */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>K</Text>
      </View>

      {/* 🌟 Título e Subtítulo */}
      <Text style={styles.khoraTitle}>Khora</Text>
      <Text style={styles.mainSlogan}>Seu espaço para cuidar de você.</Text>
      <Text style={styles.subText}>
        Explore, aprenda e cuide da sua saúde de forma anônima e segura. Sem
        tabus, sem julgamentos.
      </Text>

      {/* 🔎 Botão "Entrar" */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* 👤 Botão "Criar conta" */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/cadastro")}
      >
        <Text style={styles.secondaryButtonText}>Criar conta</Text>
      </TouchableOpacity>

      {/* ✅ Garantia de Privacidade com Vector Icon */}
      <View style={styles.privacyContainer}>
        {/* Substituindo o emoji por Ionicons */}
        <Ionicons
          name="checkmark-circle"
          size={14}
          color="#28a745" // Cor verde padrão para o check
          style={styles.checkmarkIcon}
        />
        <Text style={styles.privacyText}>Sua privacidade é garantida.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  khoraTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 20,
  },
  mainSlogan: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334D6E",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 28,
  },
  subText: {
    fontSize: 14,
    color: "#697B8C",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  // --- Botões ---
  primaryButton: {
    backgroundColor: "#3b82f6", // Cor de botão primário que você definiu
    paddingVertical: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#F0F5FF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4A90E2",
    fontWeight: "bold",
    fontSize: 16,
  },
  // --- Privacidade ---
  privacyContainer: {
    marginTop: 30,
    flexDirection: "row", // Adicionado para alinhar o ícone
    alignItems: "center", // Adicionado para alinhar o ícone
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  privacyText: {
    fontSize: 12,
    color: "#697B8C",
  },
});
