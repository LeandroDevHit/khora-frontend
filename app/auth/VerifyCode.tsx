import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as resetStyle } from "../../styles/auth/VerifyCodeStyle";

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleVerifyCode = () => {
    console.log("Verificar código:", code);
    // Lógica para verificar código
    router.push("/auth/NewPassword" as any);
  };

  const handleResendCode = () => {
    console.log("Reenviar código");
    // Lógica para reenviar código
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
            <MaterialIcons
              name="verified-user"
              size={64}
              color={Colors.primary}
            />
          </View>
          <Text style={resetStyle.title}>Verificar código</Text>
          <Text style={resetStyle.subtitle}>
            Digite o código de 6 dígitos que enviamos para seu email.
          </Text>
        </View>

        <View style={resetStyle.formContainer}>
          <Text style={resetStyle.label}>Código de verificação</Text>
          <CustomInput
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            accessibilityLabel="Digite o código de verificação"
            width="100%"
            iconName="pin"
          />
        </View>

        <View style={resetStyle.buttonContainer}>
          <CustomButton
            title="Verificar código"
            onPress={handleVerifyCode}
            variant="primary"
            width="100%"
          />
        </View>

        <View style={resetStyle.linkContainer}>
          <Text style={resetStyle.linkText}>Não recebeu o código? </Text>
          <Pressable onPress={handleResendCode}>
            <Text style={resetStyle.link}>Reenviar</Text>
          </Pressable>
        </View>

        <View style={resetStyle.infoContainer}>
          <MaterialIcons name="timer" size={16} color={Colors.textSecondary} />
          <Text style={resetStyle.infoText}>
            O código expira em 5 minutos. Verifique sua caixa de spam se não
            encontrar.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
