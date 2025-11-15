import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as resetStyle } from "../../styles/auth/ForgotPasswordStyle";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    console.log("Enviar código para:", email);
    // Lógica para enviar código de reset
    router.push("/auth/VerifyCode" as any);
  };

  const handleBackToLogin = () => {
    router.push("/auth/login" as any);
  };

  return (
    <ScrollView
      style={resetStyle.scrollView}
      contentContainerStyle={resetStyle.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={resetStyle.container}>
        <Pressable style={resetStyle.backButton} onPress={handleBackToLogin}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>

        <View style={resetStyle.header}>
          <View style={resetStyle.iconContainer}>
            <MaterialIcons name="lock-reset" size={64} color={Colors.primary} />
          </View>
          <Text style={resetStyle.title}>Esqueceu a senha?</Text>
          <Text style={resetStyle.subtitle}>
            Não se preocupe! Digite seu email e enviaremos um código para
            redefinir sua senha.
          </Text>
        </View>

        <View style={resetStyle.formContainer}>
          <Text style={resetStyle.label}>Email</Text>
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
        </View>

        <View style={resetStyle.buttonContainer}>
          <CustomButton
            title="Enviar código"
            onPress={handleSendCode}
            variant="primary"
            width="100%"
          />
        </View>

        <View style={resetStyle.linkContainer}>
          <Text style={resetStyle.linkText}>Lembrou a senha? </Text>
          <Pressable onPress={handleBackToLogin}>
            <Text style={resetStyle.link}>Voltar ao login</Text>
          </Pressable>
        </View>

        <View style={resetStyle.infoContainer}>
          <MaterialIcons name="info" size={16} color={Colors.textSecondary} />
          <Text style={resetStyle.infoText}>
            O código será enviado para o email cadastrado e expira em 5 minutos.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
