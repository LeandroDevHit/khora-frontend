import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import CustomButton from "../components/Button";
import { Colors } from "../constants/GlobalStyles";
import { style as welcomeStyle } from "../styles/welcome/WelcomeStyle";
import LogoKhora from "../assets/images/logoKhora.png";

export default function Welcome() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login" as any);
  };

  const handleAnonymous = () => {
    router.push("/tabs/home" as any);
  };

  return (
    <View style={welcomeStyle.container}>
      <View style={welcomeStyle.textContainer}>
        <View style={welcomeStyle.logoContainer}>
          <Image source={LogoKhora} style={{ width: 150 }} />
          <Text style={welcomeStyle.logoText}>Khora</Text>
        </View>

        <Text style={welcomeStyle.subtitle}>
          Seu espaço para cuidar de você.
        </Text>
        <Text style={welcomeStyle.description}>
          Explore, aprenda e cuide da sua saúde de forma anônima e segura. Sem
          tabus, sem julgamentos.
        </Text>
      </View>

      <View style={welcomeStyle.buttonsContainer}>
        <CustomButton
          title="Explorar Anonimamente"
          onPress={handleAnonymous}
          variant="primary"
        />

        <CustomButton
          title="Criar Conta ou Entrar"
          onPress={handleLogin}
          variant="secondary"
        />

        <View style={welcomeStyle.privacyContainer}>
          <MaterialIcons name="check-circle" size={24} color={Colors.success} />
          <Text style={welcomeStyle.privacyText}>
            Sua privacidade é garantida
          </Text>
        </View>
      </View>
    </View>
  );
}
