import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as resetStyle } from "../../styles/auth/NewPasswordStyle";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    console.log("Redefinir senha");
    // Lógica para redefinir senha
    // Após sucesso, navegar para login
    router.push("/auth/login" as any);
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
            <MaterialIcons name="lock-open" size={64} color={Colors.primary} />
          </View>
          <Text style={resetStyle.title}>Nova senha</Text>
          <Text style={resetStyle.subtitle}>
            Crie uma senha forte para proteger sua conta.
          </Text>
        </View>

        <View style={resetStyle.formContainer}>
          <Text style={resetStyle.label}>Nova senha</Text>
          <CustomInput
            placeholder="Mínimo 8 caracteres"
            value={newPassword}
            onChangeText={setNewPassword}
            accessibilityLabel="Digite sua nova senha"
            width="100%"
            iconName="lock"
            isPassword={true}
          />

          <Text style={resetStyle.label}>Confirmar nova senha</Text>
          <CustomInput
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            accessibilityLabel="Confirme sua nova senha"
            width="100%"
            iconName="lock"
            isPassword={true}
          />
        </View>

        <View style={resetStyle.buttonContainer}>
          <CustomButton
            title="Redefinir senha"
            onPress={handleResetPassword}
            variant="primary"
            width="100%"
          />
        </View>

        <View style={resetStyle.requirementsContainer}>
          <Text style={resetStyle.requirementsTitle}>Requisitos da senha:</Text>
          <View style={resetStyle.requirementItem}>
            <MaterialIcons
              name={
                newPassword.length >= 8
                  ? "check-circle"
                  : "radio-button-unchecked"
              }
              size={16}
              color={
                newPassword.length >= 8 ? Colors.success : Colors.textSecondary
              }
            />
            <Text style={resetStyle.requirementText}>
              Mínimo de 8 caracteres
            </Text>
          </View>
          <View style={resetStyle.requirementItem}>
            <MaterialIcons
              name={
                /[A-Z]/.test(newPassword)
                  ? "check-circle"
                  : "radio-button-unchecked"
              }
              size={16}
              color={
                /[A-Z]/.test(newPassword)
                  ? Colors.success
                  : Colors.textSecondary
              }
            />
            <Text style={resetStyle.requirementText}>
              Pelo menos uma letra maiúscula
            </Text>
          </View>
          <View style={resetStyle.requirementItem}>
            <MaterialIcons
              name={
                /[0-9]/.test(newPassword)
                  ? "check-circle"
                  : "radio-button-unchecked"
              }
              size={16}
              color={
                /[0-9]/.test(newPassword)
                  ? Colors.success
                  : Colors.textSecondary
              }
            />
            <Text style={resetStyle.requirementText}>Pelo menos um número</Text>
          </View>
          <View style={resetStyle.requirementItem}>
            <MaterialIcons
              name={
                newPassword === confirmPassword && newPassword.length > 0
                  ? "check-circle"
                  : "radio-button-unchecked"
              }
              size={16}
              color={
                newPassword === confirmPassword && newPassword.length > 0
                  ? Colors.success
                  : Colors.textSecondary
              }
            />
            <Text style={resetStyle.requirementText}>Senhas coincidem</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
