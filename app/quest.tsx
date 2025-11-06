import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, TextInput } from "react-native";
import styled from "styled-components/native";

interface QuestProps {
  onFinish: () => void;
}

export default function Quest({ onFinish }: QuestProps) {
  const [step, setStep] = useState(0);
  const [idadeSelecionada, setIdadeSelecionada] = useState<string | null>(null);
  const [altura, setAltura] = useState("");
  const [vicios, setVicios] = useState({
    fumar: false,
    beber: false,
    drogas: false,
    porno: false,
  });

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step + 1) / 3,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const toggleVicio = (key: keyof typeof vicios) => {
    setVicios({ ...vicios, [key]: !vicios[key] });
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      console.log({ idadeSelecionada, altura, vicios });
      onFinish(); // QUANDO TERMINAR, chama a função do App para ir pra Home
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAlturaChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 0) {
      if (cleaned.length === 1) setAltura(cleaned);
      else setAltura(`${cleaned[0]}.${cleaned.slice(1, 3)}`);
    } else {
      setAltura("");
    }
  };

  return (
    <Container>
      {step > 0 && (
        <BackButton onPress={goBack}>
          <Ionicons name="arrow-back" size={30} color="#007aff" />
        </BackButton>
      )}

      <BotContainer>
        <BotImage
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4712/4712141.png",
          }}
        />
        <BotText>
          Olá! Seu assistente de saúde. {"\n"}
          Vamos coletar algumas informações importantes pra você começar.
        </BotText>
      </BotContainer>

      <ProgressBarBackground>
        <ProgressBarFill
          style={{
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </ProgressBarBackground>

      <StepContainer>
        {step === 0 && (
          <>
            <SectionTitle>Qual a sua idade?</SectionTitle>
            <OptionsWrapper>
              {["18-24", "25-34", "35-44", "45-54", "55+"].map((item) => (
                <OptionButton
                  key={item}
                  selected={idadeSelecionada === item}
                  onPress={() => setIdadeSelecionada(item)}
                >
                  <OptionText selected={idadeSelecionada === item}>
                    {item}
                  </OptionText>
                </OptionButton>
              ))}
            </OptionsWrapper>
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>Qual a sua altura?</SectionTitle>
            <AlturaInput
              placeholder="1.75"
              keyboardType="numeric"
              value={altura}
              onChangeText={handleAlturaChange}
            />
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>Você possui algum vício?</SectionTitle>
            <ViciosWrapper>
              {Object.keys(vicios).map((key) => (
                <VicioButton
                  key={key}
                  selected={vicios[key as keyof typeof vicios]}
                  onPress={() => toggleVicio(key as keyof typeof vicios)}
                  activeOpacity={0.8}
                >
                  {vicios[key as keyof typeof vicios] && (
                    <Ionicons name="checkmark-circle" size={28} color="#fff" />
                  )}
                  <VicioText selected={vicios[key as keyof typeof vicios]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </VicioText>
                </VicioButton>
              ))}
            </ViciosWrapper>
          </>
        )}
      </StepContainer>

      <NextButton onPress={nextStep}>
        <NextText>Próximo</NextText>
      </NextButton>
    </Container>
  );
}

/* ---------- styled ---------- */

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 25px;
  justify-content: flex-start;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 25px;
  z-index: 2;
`;

const BotContainer = styled.View`
  align-items: center;
  margin-top: 80px;
  margin-bottom: 20px;
`;

const BotImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 15px;
`;

const BotText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: center;
  line-height: 24px;
`;

const ProgressBarBackground = styled.View`
  width: 90%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 25px;
`;

const ProgressBarFill = styled(Animated.View)`
  height: 8px;
  background-color: #007aff;
  border-radius: 4px;
`;

const StepContainer = styled.View`
  width: 100%;
  align-items: center;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 25px;
  text-align: center;
`;

const OptionsWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`;

const OptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  border: 2px solid
    ${(p: { selected: boolean }) => (p.selected ? "#007aff" : "#ccc")};
  padding: 18px 25px;
  border-radius: 15px;
  background-color: ${(p: { selected: boolean }) =>
    p.selected ? "#eaf1ff" : "#fff"};
  margin: 5px;
  min-width: 100px;
  align-items: center;
`;

const OptionText = styled.Text<{ selected: boolean }>`
  color: ${(p: { selected: boolean }) => (p.selected ? "#007aff" : "#333")};
  font-weight: 700;
  font-size: 18px;
  text-align: center;
`;

const AlturaInput = styled(TextInput)`
  border: 2px solid #ccc;
  border-radius: 15px;
  padding: 18px;
  font-size: 20px;
  width: 60%;
  text-align: center;
`;

const ViciosWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
`;

const VicioButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 48%;
  background-color: ${(p: { selected: boolean }) =>
    p.selected ? "#22c55e" : "#e5e7eb"};
  padding: 35px 0;
  border-radius: 18px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
`;

const VicioText = styled.Text<{ selected: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${(p: { selected: boolean }) => (p.selected ? "#fff" : "#111827")};
  margin-top: 10px;
  text-align: center;
`;

const NextButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 18px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 90%;
  position: absolute;
  bottom: 20px;
`;

const NextText = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
`;
