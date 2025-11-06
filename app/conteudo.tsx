import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type RootStackParamList = {
  Home: undefined;
  Conteudo: undefined;
  Prevencao: undefined;
  SaudeMental: undefined;
  Metas: undefined;
  Perfil: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COLORS = {
  primary: "#2f66ff",
  textDark: "#1d1d1f",
  textLight: "#777",
  background: "#fff",
  muted: "#f5f5f5",
};

const Conteudo: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Saúde Sexual", "Próstata", "Saúde Mental"];

  const items = [
    {
      tipo: "ARTIGO",
      titulo: "A verdade sobre a saúde da próstata",
      descricao:
        "Descubra os fatos essenciais sobre a saúde da próstata e como mantê-la em ótima forma.",
      imagem: require("../assets/images/prostata.png"),
    },
    {
      tipo: "VÍDEO",
      titulo: "Mitos e verdades sobre a saúde sexual",
      descricao:
        "Um vídeo curto e informativo para desmistificar crenças comuns sobre saúde sexual.",
      imagem: require("../assets/images/video.jpg"),
    },
    {
      tipo: "INFOGRÁFICO",
      titulo: "Nutrição para o bem-estar masculino",
      descricao:
        "Um guia visual com dicas de nutrição para otimizar a saúde e o bem-estar dos homens.",
      imagem: require("../assets/images/nutricao.jpg"),
    },
    {
      tipo: "QUIZ",
      titulo: "Mito ou Verdade? Saúde Masculina",
      descricao:
        "Teste seus conhecimentos sobre saúde masculina com este quiz interativo.",
      imagem: require("../assets/images/quiz.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conteúdo</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Título */}
      <Text style={styles.title}>Arsenal do Conhecimento</Text>

      {/* Categorias */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipo}>{item.tipo}</Text>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.descricao}>{item.descricao}</Text>
            </View>
            <Image source={item.imagem} style={styles.imagem} />
          </View>
        ))}
      </ScrollView>

      {/* TabBar */}
      <View style={styles.tabBarContainer}>
        <TabButton
          icon="home"
          label="Home"
          onPress={() => navigation.navigate("Home")}
        />
        <TabButton
          icon="shield-checkmark"
          label="Prevenção"
          onPress={() => navigation.navigate("Prevencao")}
        />
        <TabButton
          icon="book"
          label="Conteúdo"
          focused
          onPress={() => navigation.navigate("Conteudo")}
        />
        <TabButton
          icon="brain"
          label="Saúde Mental"
          onPress={() => navigation.navigate("SaudeMental")}
        />
        <TabButton
          icon="footsteps"
          label="Metas"
          onPress={() => navigation.navigate("Metas")}
        />
      </View>
    </View>
  );
};

interface TabButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  focused?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  label,
  onPress,
  focused,
}) => (
  <TouchableOpacity
    style={styles.tabItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Icon
      name={focused ? icon : `${icon}-outline`}
      size={22}
      color={focused ? COLORS.primary : COLORS.textLight}
    />
    <Text
      style={[
        styles.tabLabel,
        { color: focused ? COLORS.primary : COLORS.textLight },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.muted,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipo: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  titulo: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  descricao: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 18,
  },
  imagem: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: Platform.OS === "ios" ? 25 : 10,
  },
  tabItem: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  },
});

export default Conteudo;
