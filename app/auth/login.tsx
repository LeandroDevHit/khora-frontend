import { authenticateUser } from "@/services/authService";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { useAlert } from "../../contexts/AlertContext";
import { useUserContext } from "../../contexts/UserContext";
import { style as loginStyle } from "../../styles/auth/LoginStyle";

export default function Login() {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const { setUserEmail, setUserId } = useUserContext();
  const [email, setEmail] = useState("");
  const [password_hash, setPassword] = useState("");

  interface LoginResponse {
    message: string;
    requiresTwoFactor: boolean;
    userId: string;
  }

  const handleLogin = async () => {
    if (!email || !password_hash) {
      showError("Campos obrigatórios", "Email e senha são obrigatórios");
      return;
    }

    try {
      // Autentica o usuário
      const response = await authenticateUser(email, password_hash);
      const { message, requiresTwoFactor, userId } = response as LoginResponse;

      // Armazena o e-mail e o userId no contexto do usuário
      setUserEmail(email);
      setUserId(userId);

      showSuccess("Sucesso!", message);

      if (requiresTwoFactor) {
        setTimeout(() => {
          router.push("/auth/TwoFactorAuth" as any);
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao autenticar. Tente novamente.";
      showError("Login incorreto", errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login com Google");
    // lógica de login com Google
  };

  const handleSignUp = () => {
    router.push("/auth/Register" as any);
  };

  const handleForgotPassword = () => {
    router.push("/auth/ForgotPassword" as any);
  };

  return (
    <ScrollView
      style={loginStyle.scrollView}
      contentContainerStyle={loginStyle.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={loginStyle.container}>
        <View style={loginStyle.header}>
          <Text style={loginStyle.title}>Bem-vindo ao Khora</Text>
          <Text style={loginStyle.subtitle}>
            Entre para continuar sua jornada
          </Text>
        </View>

        <View style={loginStyle.formContainer}>
          <Text style={loginStyle.label}>Email</Text>
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

          <View style={loginStyle.passwordLabelContainer}>
            <Text style={loginStyle.label}>Senha</Text>
            <Pressable
              style={loginStyle.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={loginStyle.forgotPasswordText}>
                Esqueceu a senha?
              </Text>
            </Pressable>
          </View>

          <CustomInput
            placeholder="********"
            value={password_hash}
            onChangeText={setPassword}
            accessibilityLabel="Digite sua senha"
            width="100%"
            iconName="lock"
            isPassword={true}
          />
        </View>

        <View style={loginStyle.buttonContainer}>
          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            variant="primary"
            width="100%"
          />
          <CustomButton
            title="Entrar com Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            width="100%"
            iconLeft={
              <FontAwesome name="google" size={20} color={Colors.primary} />
            }
          />
        </View>

        <View style={loginStyle.dividerContainer}>
          <View style={loginStyle.divider} />
          <Text style={loginStyle.dividerText}>ou</Text>
          <View style={loginStyle.divider} />
        </View>

        <View style={loginStyle.signUpContainer}>
          <Text style={loginStyle.signUpText}>Não tem uma conta? </Text>
          <Pressable onPress={handleSignUp}>
            <Text style={loginStyle.signUpLink}>Cadastre-se</Text>
          </Pressable>
        </View>

        <View style={loginStyle.privacyContainer}>
          <MaterialIcons name="lock" size={16} color={Colors.textPrimary} />
          <Text style={loginStyle.privacyText}>
            Seus dados estão seguros e protegidos
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
