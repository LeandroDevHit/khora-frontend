import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as registerStyle } from "../../styles/auth/RegisterStyle";
import { useAlert } from "@/contexts/AlertContext";
import { registerUser } from "@/services/authService";

interface RegisterProps {
  message: string;
}

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showSuccess, showError } = useAlert();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        showError("Erro ao cadastrar", "Todos os campos são obrigatórios");
      }
      if (password !== confirmPassword) {
        showError("Erro ao cadastrar", "As senhas não coincidem");
      }

      const response = await registerUser(name, email, password);
      const { message } = response as RegisterProps;

      showSuccess("Sucesso!", message);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      showError("Erro ao cadastrar", errorMessage);
    }
  };

  const handleGoogleRegister = () => {
    console.log("Cadastro com Google");
    // lógica de cadastro com Google
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <ScrollView
      style={registerStyle.scrollView}
      contentContainerStyle={registerStyle.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={registerStyle.container}>
        <View style={registerStyle.header}>
          <Text style={registerStyle.title}>Crie sua conta</Text>
          <Text style={registerStyle.subtitle}>
            Junte-se à comunidade Khora
          </Text>
        </View>

        <View style={registerStyle.formContainer}>
          <Text style={registerStyle.label}>Nome completo</Text>
          <CustomInput
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            accessibilityLabel="Digite seu nome"
            width="100%"
            iconName="person"
          />

          <Text style={registerStyle.label}>Email</Text>
          <CustomInput
            placeholder="khora@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Digite seu email"
            width="100%"
            iconName="email"
          />

          <Text style={registerStyle.label}>Senha</Text>
          <CustomInput
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Digite sua senha"
            width="100%"
            iconName="lock"
            isPassword={true}
          />

          <Text style={registerStyle.label}>Confirmar senha</Text>
          <CustomInput
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            accessibilityLabel="Confirme sua senha"
            width="100%"
            iconName="lock"
            isPassword={true}
          />
        </View>

        <View style={registerStyle.buttonContainer}>
          <CustomButton
            title="Criar conta"
            onPress={handleRegister}
            variant="primary"
            width="100%"
          />
          <CustomButton
            title="Cadastrar com Google"
            onPress={handleGoogleRegister}
            variant="secondary"
            width="100%"
            iconLeft={
              <FontAwesome name="google" size={20} color={Colors.primary} />
            }
          />
        </View>

        <View style={registerStyle.dividerContainer}>
          <View style={registerStyle.divider} />
          <Text style={registerStyle.dividerText}>ou</Text>
          <View style={registerStyle.divider} />
        </View>

        <View style={registerStyle.signInContainer}>
          <Text style={registerStyle.signInText}>Já tem uma conta? </Text>
          <Pressable onPress={handleLogin}>
            <Text style={registerStyle.signInLink}>Entrar</Text>
          </Pressable>
        </View>

        <View style={registerStyle.termsContainer}>
          <MaterialIcons name="info" size={16} color={Colors.textSecondary} />
          <Text style={registerStyle.termsText}>
            Ao criar uma conta, você concorda com nossos Termos de Uso e
            Política de Privacidade
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
