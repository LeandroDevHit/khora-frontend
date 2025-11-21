import { useAlert } from "@/contexts/AlertContext";
import { useUserContext } from "@/contexts/UserContext";
import {
  resendCodeResetPassword,
  verifyCodeResetPassword,
} from "@/services/authService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as resetStyle } from "../../styles/auth/VerifyCodeStyle";

interface VerifyCodeResponse {
  message: string;
  userEmail: string;
  userId: string;
  email: string;
}

export default function VerifyCode() {
  const router = useRouter();
  const { userEmail, setUserId } = useUserContext();
  const email = userEmail;
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { showSuccess, showError } = useAlert();

  // Funções auxiliares
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBackToLogin = () => {
    router.push("/auth/login" as any);
  };

  // Lógica de verificação de código
    const handleVerifyCode = async () => {
      try {
        if (!code) {
          showError(
            "Erro ao verificar código",
            "Insira o código de verificação."
          );
          return;
        }

        if (!email) {
          showError(
            "Erro ao verificar código",
            "Email não encontrado. Por favor, volte e tente novamente."
          );
          return;
        }

        const response = await verifyCodeResetPassword(email, code);
        const { message, userId } = response as VerifyCodeResponse;

        setUserId(userId);

        showSuccess("Sucesso!", message);

        setTimeout(() => {
            router.replace("/auth/ResetPassword" as any);
        }, 2000);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao verificar código.";
        showError("Erro ao verificar código", errorMessage);
      }
    }
  // Lógica para reenviar código
    const handleResendCode = async () => {
      if (canResend) {

        if (!email) {
          showError(
            "Erro ao reenviar código",
            "Email não encontrado. Por favor, volte e tente novamente."
          );
          return;
        }

        try {
          const response = await resendCodeResetPassword(email);
          const { message } = response as VerifyCodeResponse;

          showSuccess("Código reenviado", message);

          setCountdown(180);
          setResendCountdown(60);
          setCanResend(false);
          setCode("");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Erro ao reenviar código.";
          showError("Erro ao reenviar código", errorMessage);
        }
      }
    };

  // Efeitos para contadores
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  // Renderização do componente
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

        <View style={resetStyle.timerContainer}>
          <MaterialIcons
            name={countdown > 0 ? "timer" : "timer-off"}
            size={16}
            color={countdown > 0 ? Colors.primary : Colors.error}
          />
          <Text
            style={[
              resetStyle.timerText,
              countdown === 0 && resetStyle.timerExpired,
            ]}
          >
            {countdown > 0
              ? `O código expira em ${formatTime(countdown)}`
              : "Código expirado"}
          </Text>
        </View>

        <View style={resetStyle.buttonContainer}>
          <CustomButton
            title="Verificar código"
            onPress={handleVerifyCode}
            variant="primary"
            width="100%"
            disabled={code.length !== 6}
          />
        </View>

        <View style={resetStyle.linkContainer}>
          <Text style={resetStyle.linkText}>Não recebeu o código? </Text>
          <Pressable onPress={handleResendCode} disabled={!canResend}>
            <Text
              style={[resetStyle.link, !canResend && resetStyle.linkDisabled]}
            >
              {canResend
                ? "Reenviar"
                : `Aguarde ${formatTime(resendCountdown)}`}
            </Text>
          </Pressable>
        </View>

        <View style={resetStyle.infoContainer}>
          <MaterialIcons name="timer" size={16} color={Colors.textSecondary} />
          <Text style={resetStyle.infoText}>
            O código expira em 3 minutos. Verifique sua caixa de spam se não
            encontrar.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
