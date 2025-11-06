import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native"; // Adicionando tipos para clareza
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- CORES KHORA ---
const KHORA_COLORS = {
  primary: "#3b82f6", // Azul Principal
  darkText: "#334D6E", // Texto Escuro
  secondaryText: "#697B8C", // Cinza Sutil
  lightBlueBg: "#E6F0FF", // Fundo Azul Claro
  cardBg: "#FFFFFF", // Fundo do Card
  divider: "#F1F5F9", // Cinza Claro para divisores/fundo da tela
};

// --- Tipagem de Dados para o Conteúdo ---
type ContentType = "ARTIGO" | "VÍDEO" | "INFOGRÁFICO" | "QUIZ";

interface ContentItemProps {
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
}

// Para usar a tipagem completa do StyleSheet.create
type ContentTypeStyles = {
  [K in Lowercase<ContentType>]: TextStyle;
};

// --- Componente Reutilizável: Card de Conteúdo ---
const ContentCard: React.FC<ContentItemProps> = ({
  type,
  title,
  description,
  imageUrl,
}) => (
  <TouchableOpacity style={contentStyles.cardContainer} activeOpacity={0.8}>
    <View style={contentStyles.textWrapper}>
      {/* Tipo do Conteúdo */}
      <Text
        style={[
          contentStyles.typeTag,
          (contentStyles as ContentTypeStyles)[type.toLowerCase() as "artigo"],
        ]}
      >
        {type}
      </Text>

      {/* Título */}
      <Text style={contentStyles.title}>{title}</Text>

      {/* Descrição */}
      <Text style={contentStyles.description}>{description}</Text>
    </View>

    {/* Imagem/Ícone do Card (Placeholder) */}
    <View style={contentStyles.imagePlaceholder}>
      <Image
        style={contentStyles.image}
        source={{ uri: imageUrl }}
        alt={`Imagem para ${title}`}
      />
    </View>
  </TouchableOpacity>
);

// --- TELA DE CONTEÚDO PRINCIPAL ---

export default function Conteudo() {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState("Saúde Sexual");

  // Dados mockados
  const contentData: ContentItemProps[] = [
    {
      type: "ARTIGO",
      title: "A verdade sobre a saúde da próstata",
      description:
        "Descubra os fatos essenciais sobre a saúde da próstata e como mantê-la em ótima forma.",
      imageUrl: "https://placehold.co/80x80/d6e0e7/d6e0e7?text=",
    },
    {
      type: "VÍDEO",
      title: "Mitos e verdades sobre a saúde sexual",
      description:
        "Um vídeo curto e informativo para desmistificar crenças comuns sobre saúde sexual.",
      imageUrl: "https://placehold.co/80x80/d6e0e7/d6e0e7?text=",
    },
    {
      type: "INFOGRÁFICO",
      title: "Nutrição para o bem-estar masculino",
      description:
        "Um guia visual com dicas de nutrição para otimizar a saúde e o bem-estar dos homens.",
      imageUrl: "https://placehold.co/80x80/d6e0e7/d6e0e7?text=",
    },
    {
      type: "QUIZ",
      title: "Mito ou Verdade? Saúde Masculina",
      description:
        "Teste seus conhecimentos sobre saúde masculina com este quiz interativo e divertido.",
      imageUrl: "https://placehold.co/80x80/d6e0e7/d6e0e7?text=",
    },
  ];

  const tags = [
    "Todos",
    "Saúde Sexual",
    "Próstata",
    "Saúde Mental",
    "Nutrição",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER (Topo da Tela) --- */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={KHORA_COLORS.darkText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conteúdo</Text>
        <Ionicons
          name="alert-circle-outline"
          size={24}
          color={KHORA_COLORS.darkText}
        />
      </View>

      {/* --- TÍTULO PRINCIPAL --- */}
      <View style={styles.titleWrapper}>
        <Text style={styles.mainTitle}>Arsenal do</Text>
        <Text style={styles.mainTitle}>Conhecimento</Text>
      </View>

      {/* --- NAVEGAÇÃO DE TAGS (Horizontal Scroll) --- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsScroll as ViewStyle}
        contentContainerStyle={styles.tagsContainer}
      >
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => setActiveTag(tag)}
            style={[
              tagStyles.tagButton,
              activeTag === tag && tagStyles.tagButtonActive,
            ]}
          >
            <Text
              style={[
                tagStyles.tagText,
                activeTag === tag && tagStyles.tagTextActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- LISTA DE CONTEÚDO (Vertical Scroll) --- */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {contentData.map((item, index) => (
          <ContentCard key={index} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS GERAIS DA TELA ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KHORA_COLORS.cardBg,
  } as ViewStyle,

  // Header (Topo da Tela)
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 5,
  } as ViewStyle,
  backButton: {
    width: 24,
    height: 24,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: KHORA_COLORS.darkText,
    marginRight: -24,
  } as TextStyle,

  // Título Principal
  titleWrapper: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 5,
  } as ViewStyle,
  mainTitle: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 38,
    color: KHORA_COLORS.darkText,
  } as TextStyle,

  // Navegação de Tags
  tagsScroll: {
    marginBottom: -1,
    minHeight: 60,
  } as ViewStyle,
  tagsContainer: {
    paddingHorizontal: 25,
    paddingRight: 40,
    paddingBottom: 5,
  } as ViewStyle,

  // Lista de Conteúdo
  listContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 90,
  } as ViewStyle,
});

// --- ESTILOS DAS TAGS ---
const tagStyles = StyleSheet.create({
  tagButton: {
    paddingVertical: 18,
    paddingHorizontal: 0,
    marginRight: 28,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  } as ViewStyle,
  tagButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: KHORA_COLORS.primary,
    paddingBottom: 3,
  } as ViewStyle,
  tagText: {
    fontSize: 16,
    fontWeight: "600",
    color: KHORA_COLORS.secondaryText,
  } as TextStyle,
  tagTextActive: {
    color: KHORA_COLORS.darkText,
    fontWeight: "700",
  } as TextStyle,
});

// --- ESTILOS DOS CARDS DE CONTEÚDO ---
const contentStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: KHORA_COLORS.divider,
  } as ViewStyle,
  textWrapper: {
    flex: 1,
    paddingRight: 20,
  } as ViewStyle,
  typeTag: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  } as TextStyle,
  artigo: {
    color: "#E04E4E",
  } as TextStyle,
  vídeo: {
    color: "#3498db",
  } as TextStyle,
  infográfico: {
    color: "#27ae60",
  } as TextStyle,
  quiz: {
    color: "#f1c40f",
  } as TextStyle,

  title: {
    fontSize: 19,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
    marginBottom: 5,
  } as TextStyle,
  description: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
    lineHeight: 20,
  } as TextStyle,
  imagePlaceholder: {
    width: 100, // AJUSTADO
    height: 100, // AJUSTADO
    borderRadius: 8,
    backgroundColor: KHORA_COLORS.divider,
    overflow: "hidden",
  } as ViewStyle,
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  } as ImageStyle,
});
