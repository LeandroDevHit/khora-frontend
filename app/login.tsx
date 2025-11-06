import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";

interface LoginProps {
  setIsLoggedIn: (val: boolean) => void;
  setIsNewUser: (val: boolean) => void;
}

export default function Login({ setIsLoggedIn, setIsNewUser }: LoginProps) {
  const [mode, setMode] = useState<"initial" | "login" | "signup">("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsNewUser(false); // entra no Home
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setIsNewUser(true); // entra no Quest
  };

  return (
    <Container>
      {/* Logo, título e descrição */}
      <LogoCircle>
        <LogoText>K</LogoText>
      </LogoCircle>
      <Title>Khora</Title>
      <Subtitle>Seu espaço para cuidar de você.</Subtitle>
      <Description>
        Explore, aprenda e cuide da sua saúde de forma anônima e segura. {"\n"}
        Sem tabus, sem julgamentos.
      </Description>

      {mode === "initial" && (
        <>
          <PrimaryButton>
            <PrimaryButtonText>Explorar anonimamente</PrimaryButtonText>
          </PrimaryButton>
          <SecondaryButton onPress={() => setMode("login")}>
            <SecondaryButtonText>Criar conta ou Entrar</SecondaryButtonText>
          </SecondaryButton>
        </>
      )}

      {mode === "login" && (
        <>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <PrimaryButton onPress={handleLogin}>
            <PrimaryButtonText>Entrar</PrimaryButtonText>
          </PrimaryButton>
          <SecondaryButton onPress={() => setMode("signup")}>
            <SecondaryButtonText>Criar conta</SecondaryButtonText>
          </SecondaryButton>
        </>
      )}

      {mode === "signup" && (
        <>
          <Input
            placeholder="Nome"
            value={signupName}
            onChangeText={setSignupName}
          />
          <Input
            placeholder="Email"
            value={signupEmail}
            onChangeText={setSignupEmail}
            keyboardType="email-address"
          />
          <Input
            placeholder="Senha"
            value={signupPassword}
            onChangeText={setSignupPassword}
            secureTextEntry
          />
          <PrimaryButton onPress={handleSignup}>
            <PrimaryButtonText>Criar conta</PrimaryButtonText>
          </PrimaryButton>
          <TouchableText onPress={() => setMode("login")}>
            <TextLogin>Já tem conta? Entrar</TextLogin>
          </TouchableText>
        </>
      )}

      <PrivacyWrapper>
        <Feather
          name="check-circle"
          size={18}
          color="#22c55e"
          style={{ marginRight: 6 }}
        />
        <PrivacyText>Sua privacidade é garantida.</PrivacyText>
      </PrivacyWrapper>
    </Container>
  );
}

// -------- Styled Components --------

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f9fbff;
  align-items: center;
  justify-content: center;
  padding: 30px 24px;
`;

const LogoCircle = styled(View)`
  width: 85px;
  height: 85px;
  border-radius: 42.5px;
  background-color: #e8f0ff;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
`;

const LogoText = styled(Text)`
  font-size: 34px;
  color: #2957ff;
  font-weight: 700;
`;

const Title = styled(Text)`
  font-size: 30px;
  font-weight: 800;
  color: rgb(31, 59, 138);
  margin-bottom: 10px;
`;

const Subtitle = styled(Text)`
  font-size: 17px;
  color: #333;
  margin-bottom: 18px;
  text-align: center;
`;

const Description = styled(Text)`
  font-size: 15px;
  color: #666;
  text-align: center;
  line-height: 22px;
  margin-bottom: 40px;
  padding: 0 10px;
`;

const Input = styled(TextInput)`
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 12px;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  background-color: #fff;
`;

const PrimaryButton = styled(TouchableOpacity)`
  background-color: #3b82f6;
  padding: 16px 30px;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  margin-bottom: 14px;
`;

const PrimaryButtonText = styled(Text)`
  color: #fff;
  font-weight: 600;
  font-size: 15px;
`;

const SecondaryButton = styled(TouchableOpacity)`
  background-color: #eef4ff;
  padding: 16px 30px;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  margin-bottom: 28px;
`;

const SecondaryButtonText = styled(Text)`
  color: #2957ff;
  font-weight: 600;
  font-size: 15px;
`;

const TouchableText = styled(TouchableOpacity)`
  margin-top: 10px;
`;

const TextLogin = styled(Text)`
  color: #3b82f6;
  font-size: 14px;
  text-align: center;
`;

const PrivacyWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const PrivacyText = styled(Text)`
  font-size: 13px;
  color: #4b5563;
`;
