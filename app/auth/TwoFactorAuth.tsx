import { useAlert } from "@/contexts/AlertContext";
import { useUserContext } from "@/contexts/UserContext";
import {
  resendTwoFactorCode,
  verifyTwoFactorCode,
} from "@/services/authService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { maskEmail } from "../../assets/utils/maskEmail";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { Colors } from "../../constants/GlobalStyles";
import { style as twoFactorStyle } from "../../styles/auth/TwoFactorAuthStyle";

interface TwoFactorAuth {
  isFirstLogin: boolean
  message: string;
  userId: string;
}

export default function TwoFactorAuth() {
  const router = useRouter();
  const { userEmail, userId } = useUserContext();
  const maskedEmail = userEmail ? maskEmail(userEmail) : "email não disponível";
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { showSuccess, showError } = useAlert();

  // Timer para expiração do código
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Timer para habilitar o botão de reenviar
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyCode = async () => {
    try {
      if (code.length !== 6) {
        showError("Erro ao verificar código", "O código deve ter 6 dígitos.");
        return;
      }

      if (!userId) {
        showError(
          "Erro ao verificar código",
          "Usuário não identificado. Por favor, faça login novamente."
        );
        return;
      }

      const response = await verifyTwoFactorCode(code, userId);
      const { message, isFirstLogin } = response as TwoFactorAuth;


      showSuccess("Sucesso!", message);

      setTimeout(() => {
        if (isFirstLogin) {
          // Primeiro login: vai para a quest
          router.replace("/quest" as any);
        } else {
          // Login subsequente: vai para a home
          router.replace("/tabs/home" as any);
        }
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao verificar código.";
      showError("Erro ao verificar código", errorMessage);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      if (!userId) {
        showError(
          "Erro ao reenviar código",
          "Usuário não identificado. Por favor, faça login novamente."
        );
        return;
      }

      try {
        const response = await resendTwoFactorCode(userId);
        const { message } = response as TwoFactorAuth;

        showSuccess("Código reenviado", message);

        // Lógica para reenviar código
        setCountdown(180); // Reinicia o contador de expiração
        setResendCountdown(60); // Reinicia o contador de reenvio
        setCanResend(false);
        setCode(""); // Limpa o código
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Erro ao reenviar código.";
        showError("Erro ao reenviar código", errorMessage);
      }
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login" as any);
  };

  return (
    <ScrollView
      style={twoFactorStyle.scrollView}
      contentContainerStyle={twoFactorStyle.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={twoFactorStyle.container}>
        <Pressable
          style={twoFactorStyle.backButton}
          onPress={handleBackToLogin}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>

        <View style={twoFactorStyle.header}>
          <View style={twoFactorStyle.iconContainer}>
            <MaterialIcons name="security" size={64} color={Colors.primary} />
          </View>
          <Text style={twoFactorStyle.title}>Autenticação de 2 Fatores</Text>
          <Text style={twoFactorStyle.subtitle}>
            Digite o código de 6 dígitos que enviamos para seu email para
            completar o login com segurança.
          </Text>
        </View>

        <View style={twoFactorStyle.emailInfoContainer}>
          <MaterialIcons name="email" size={20} color={Colors.primary} />
          <Text style={twoFactorStyle.emailInfoText}>
            Código enviado para: {maskedEmail}
          </Text>
        </View>

        <View style={twoFactorStyle.formContainer}>
          <Text style={twoFactorStyle.label}>Código de verificação</Text>
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

        <View style={twoFactorStyle.timerContainer}>
          <MaterialIcons
            name={countdown > 0 ? "timer" : "timer-off"}
            size={16}
            color={countdown > 0 ? Colors.primary : Colors.error}
          />
          <Text
            style={[
              twoFactorStyle.timerText,
              countdown === 0 && twoFactorStyle.timerExpired,
            ]}
          >
            {countdown > 0
              ? `O código expira em ${formatTime(countdown)}`
              : "Código expirado"}
          </Text>
        </View>

        <View style={twoFactorStyle.buttonContainer}>
          <CustomButton
            title="Verificar e Entrar"
            onPress={handleVerifyCode}
            variant="primary"
            width="100%"
            disabled={code.length !== 6}
          />
        </View>

        <View style={twoFactorStyle.linkContainer}>
          <Text style={twoFactorStyle.linkText}>Não recebeu o código? </Text>
          <Pressable onPress={handleResendCode} disabled={!canResend}>
            <Text
              style={[
                twoFactorStyle.link,
                !canResend && twoFactorStyle.linkDisabled,
              ]}
            >
              {canResend
                ? "Reenviar"
                : `Aguarde ${formatTime(resendCountdown)}`}
            </Text>
          </Pressable>
        </View>

        <View style={twoFactorStyle.securityInfoContainer}>
          <MaterialIcons name="shield" size={16} color={Colors.success} />
          <Text style={twoFactorStyle.securityInfoText}>
            A autenticação de 2 fatores adiciona uma camada extra de segurança à
            sua conta.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
