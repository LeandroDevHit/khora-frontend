import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// CORREÇÃO: Importando ImageStyle
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

// Tipagem dos vícios
interface ViciosState {
  fumar: boolean;
  beber: boolean;
  drogas: boolean;
  porno: boolean;
}

export default function Quest() {
  const router = useRouter();

  // --- LÓGICA DE ESTADO ORIGINAL ASSIMILADA ---
  const [step, setStep] = useState(0);
  const [idadeSelecionada, setIdadeSelecionada] = useState<string | null>(null);
  const [altura, setAltura] = useState("");
  // NOVO: Estado para armazenar o peso
  const [peso, setPeso] = useState("");
  const [vicios, setVicios] = useState<ViciosState>({
    fumar: false,
    beber: false,
    drogas: false,
    porno: false,
  });

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // AQUI: O total de passos é 4 (0 a 3)
    Animated.timing(progress, {
      toValue: (step + 1) / 4,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [step, progress]);

  const toggleVicio = (key: keyof ViciosState) => {
    setVicios({ ...vicios, [key]: !vicios[key] });
  };

  const nextStep = () => {
    // AQUI: O total de passos é 4 (índices 0, 1, 2, 3). O último índice é 3.
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log({ idadeSelecionada, altura, peso, vicios });
      // Quando terminar, navega para a Home
      router.push("/tabs/home");
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAlturaChange = (text: string) => {
    // Lógica de formatação de altura 1.75
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 0) {
      if (cleaned.length === 1) setAltura(cleaned);
      else setAltura(`${cleaned[0]}.${cleaned.slice(1, 3)}`);
    } else {
      setAltura("");
    }
  };

  const handlePesoChange = (text: string) => {
    // Permite números e um ponto decimal (ex: 75.5)
    let cleaned = text.replace(/[^0-9.]/g, "");
    setPeso(cleaned);
  };

  const idadeOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];

  // Função auxiliar para renderizar o título do Bot
  const renderBotTitle = () => {
    if (step === 0) return "Olá! Seu assistente de saúde.";
    if (step === 1) return "Ótimo! Agora, a próxima pergunta.";
    if (step === 2) return "Quase lá."; // Título para o passo Peso
    if (step === 3) return "Última pergunta!"; // Título para o passo Vícios
    return "";
  };

  // Função auxiliar para renderizar a descrição do Bot
  const renderBotDescription = () => {
    if (step === 0)
      return "Vamos coletar algumas informações importantes pra você começar.";
    if (step === 1)
      return "Sua altura é vital para calcularmos seus índices de saúde.";
    // Descrição para o passo Peso
    if (step === 2)
      return "Seu peso é essencial para calcularmos seu IMC e acompanharmos seu progresso.";
    if (step === 3)
      return "Seja sincero(a), esses dados nos ajudam a personalizar seu plano.";
    return "";
  };

  // --- RENDERIZAÇÃO ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de Voltar - Aparece a partir do passo 1 */}
      {step > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={30} color={KHORA_COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* ScrollView para garantir que o conteúdo não seja cortado */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Container do Assistente (Bot) - Fixo no topo */}
        <View style={styles.botContainer}>
          <Image
            style={styles.botImage}
            // REVERTIDO: Voltando para a chamada local, mas isso pode causar o erro de "UnableToResolveError"
            // se o arquivo 'bot.jpg' não estiver no caminho correto.
            source={require("../assets/images/bot.jpg")}
          />
          <Text style={styles.botTitleText}>{renderBotTitle()}</Text>
          <Text style={styles.botText}>{renderBotDescription()}</Text>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        {/* Conteúdo do Passo Atual */}
        <View style={styles.stepContainer}>
          {/* Passo 0: Idade */}
          {step === 0 && (
            <>
              <Text style={styles.sectionTitle}>Qual a sua idade?</Text>
              <View style={styles.optionsWrapper}>
                {idadeOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.optionButton,
                      idadeSelecionada === item && styles.optionButtonSelected,
                    ]}
                    onPress={() => setIdadeSelecionada(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        idadeSelecionada === item && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Passo 1: Altura */}
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>
                Qual a sua altura? (Ex: 1.75)
              </Text>
              <TextInput
                style={styles.alturaInput}
                placeholder="1.75"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                value={altura}
                onChangeText={handleAlturaChange}
              />
            </>
          )}

          {/* PASSO 2: Peso */}
          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>
                Qual o seu peso atual? (Ex: 75.5 kg)
              </Text>
              <TextInput
                style={styles.alturaInput} // Reutilizando o estilo do input de altura
                placeholder="75.5"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                value={peso}
                onChangeText={handlePesoChange}
              />
            </>
          )}

          {/* Passo 3: Vícios */}
          {step === 3 && (
            <>
              <Text style={styles.sectionTitle}>Você possui algum vício?</Text>
              <View style={styles.viciosWrapper}>
                {Object.keys(vicios).map((key) => {
                  const vicioKey = key as keyof ViciosState;
                  const isSelected = vicios[vicioKey];
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.vicioButton,
                        isSelected && styles.vicioButtonSelected,
                      ]}
                      onPress={() => toggleVicio(vicioKey)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#fff"
                        />
                      )}
                      <Text
                        style={[
                          styles.vicioText,
                          isSelected && styles.vicioTextSelected,
                        ]}
                      >
                        {vicioKey.charAt(0).toUpperCase() + vicioKey.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Botão Próximo (Fixo na parte inferior) */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={nextStep}
        // Desabilitar se o passo 0 não tiver seleção
        disabled={step === 0 && idadeSelecionada === null}
      >
        <Text style={styles.nextText}>
          {step < 3 ? "Próximo" : "Finalizar"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- CORES KHORA ---
const KHORA_COLORS = {
  primary: "#3b82f6", // Azul Principal
  darkText: "#334D6E", // Texto Escuro
  lightBlueBg: "#E6F0FF", // Fundo Azul Claro (Selected BG)
  success: "#28a745", // Verde para sucesso/vício selecionado
  unselectedBorder: "#D1D5DB", // Cinza para borda
};

// --- ESTILOS REACT NATIVE (Substituindo styled-components) ---

interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  backButton: ViewStyle;
  botContainer: ViewStyle;
  botImage: ImageStyle;
  botTitleText: TextStyle;
  botText: TextStyle;
  progressBarBackground: ViewStyle;
  progressBarFill: ViewStyle;
  stepContainer: ViewStyle;
  sectionTitle: TextStyle;
  optionsWrapper: ViewStyle;
  optionButton: ViewStyle;
  optionButtonSelected: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
  alturaInput: TextStyle;
  viciosWrapper: ViewStyle;
  vicioButton: ViewStyle;
  vicioButtonSelected: ViewStyle;
  vicioText: TextStyle;
  vicioTextSelected: TextStyle;
  nextButton: ViewStyle;
  nextText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // Padding superior é gerenciado pela SafeAreaView, mas o Botão de Voltar precisa de espaço
  },
  // Garante rolagem e centraliza o conteúdo em telas maiores/menores
  scrollContent: {
    paddingHorizontal: 25,
    // MAIS FOLGA EMBAIXO: Aumentado de 150 para 170
    paddingBottom: 170,
    // MAIS ESPAÇO NO TOPO: Aumentado de 70 para 90 (empurra o conteúdo mais para baixo)
    paddingTop: 90,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20, // Ajuste para SafeArea/Status Bar
    left: 25,
    zIndex: 2,
  },
  botContainer: {
    alignItems: "center",
    marginTop: 30, // Mantido para um bom espaçamento com o paddingTop
    marginBottom: 20,
  },
  botImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    // Efeito Khora: Borda sutil
    borderWidth: 3,
    borderColor: KHORA_COLORS.lightBlueBg,
  },
  botTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: KHORA_COLORS.darkText,
    textAlign: "center",
    marginBottom: 5,
  },
  botText: {
    fontSize: 16,
    color: "#697B8C", // Cinza sutil
    textAlign: "center",
    lineHeight: 24,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: KHORA_COLORS.lightBlueBg,
    borderRadius: 4,
    marginBottom: 35, // Mais espaço após a barra
  },
  progressBarFill: {
    height: 8,
    backgroundColor: KHORA_COLORS.primary,
    borderRadius: 4,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
    marginBottom: 25,
    textAlign: "center",
  },
  optionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: KHORA_COLORS.unselectedBorder, // Cinza padrão Khora
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    backgroundColor: "#fff",
    margin: 5,
    minWidth: 100,
    alignItems: "center",
  },
  optionButtonSelected: {
    borderColor: KHORA_COLORS.primary, // Borda azul Khora
    backgroundColor: KHORA_COLORS.lightBlueBg, // Fundo azul claro Khora
  },
  optionText: {
    color: KHORA_COLORS.darkText,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  optionTextSelected: {
    color: KHORA_COLORS.primary, // Texto azul Khora
  },
  alturaInput: {
    borderWidth: 2,
    borderColor: KHORA_COLORS.unselectedBorder,
    borderRadius: 15,
    padding: 18,
    fontSize: 20,
    width: "60%",
    textAlign: "center",
    color: KHORA_COLORS.darkText,
    backgroundColor: KHORA_COLORS.lightBlueBg, // Fundo levemente azulado
  },
  viciosWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  vicioButton: {
    width: "48%",
    backgroundColor: KHORA_COLORS.lightBlueBg,
    paddingVertical: 35,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  vicioButtonSelected: {
    backgroundColor: KHORA_COLORS.success, // Verde sucesso
  },
  vicioText: {
    fontSize: 20,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
    marginTop: 10,
    textAlign: "center",
  },
  vicioTextSelected: {
    color: "white",
  },
  nextButton: {
    backgroundColor: KHORA_COLORS.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    position: "absolute",
    // MAIS PARA CIMA: Aumentado de 50 para 65
    bottom: 65,
    alignSelf: "center", // Centraliza o botão na largura
    // Shadow (opcional, mas adiciona profundidade)
    shadowColor: KHORA_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  nextText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
});
