import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Cadastro: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const handleCadastro = () => {
    console.log("Dados de Cadastro:", { email, nome, senha });
    router.push("/quest");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* ⬅️ Botão de Voltar/Sair (Geralmente leva para a tela anterior no stack) */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#334D6E" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          {/* 🚀 Logo/Inicial 'K' */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>K</Text>
          </View>

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Junte-se ao seu novo espaço de autocuidado.
          </Text>

          {/* 📧 Campo E-mail */}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#697B8C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* 👤 Campo Nome */}
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#697B8C"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          {/* 🔒 Campo Senha */}
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#697B8C"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
          />

          {/* Botão Cadastrar - Cor Primária Khora */}
          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Link para Login - CORREÇÃO DE NAVEGAÇÃO */}
          <TouchableOpacity
            // >>> MUDANÇA AQUI: Navega diretamente para /login <<<
            onPress={() => router.push("/login")}
            style={{ marginBottom: 20 }}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta?{" "}
              <Text style={styles.loginLinkHighlight}>Entrar</Text>
            </Text>
          </TouchableOpacity>

          {/* ✅ Garantia de Privacidade */}
          <View style={styles.privacyContainer}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color="#28a745"
              style={styles.checkmarkIcon}
            />
            <Text style={styles.privacyText}>Sua privacidade é garantida.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Tipagem para Styles (mantida inalterada)
interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  contentWrapper: ViewStyle;
  backButton: ViewStyle;
  logoContainer: ViewStyle;
  logoText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  loginLinkText: TextStyle;
  loginLinkHighlight: TextStyle;
  privacyContainer: ViewStyle;
  checkmarkIcon: TextStyle;
  privacyText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 50,
  },
  contentWrapper: {
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#334D6E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#697B8C",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#E6F0FF",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
    color: "#334D6E",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLinkText: {
    color: "#697B8C",
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  privacyText: {
    fontSize: 12,
    color: "#697B8C",
  },
});

export default Cadastro;
