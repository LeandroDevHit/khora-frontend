import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Tipagem das rotas do app
export type RootStackParamList = {
  Home: undefined;
  Perfil: undefined;
  Prevenção: undefined;
  Conteudo: undefined;
  SaudeMental: undefined;
  Metas: undefined;
};

// Tipagem do navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Dimensões da tela para layout responsivo
const { width } = Dimensions.get("window");

// --- PALETA DE CORES ---
const COLORS = {
  primary: "#3b82f6",
  textDark: "#1d1d1f",
  textMedium: "#555555",
  textLight: "#999999",
  background: "#f8f8f8",
  card: "#ffffff",
  separator: "#e0e0e0",
  iconBgBlue: "#eef3ff",
  iconBlue: "#4a7dff",
  iconBgGreen: "#e6fff0",
  iconGreen: "#70c770",
  title: "#1f3b8aff",
};

// --- INTERFACES TYPESCRIPT ---
interface DailySummaryItemProps {
  iconName: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
  title: string;
  subtitle: string;
  color: string;
  iconBackground: string;
}

interface TabBarItemProps {
  iconName: string;
  label: string;
  isFocused: boolean;
}

// --- Componentes Reutilizáveis ---
// 1. HEADER
const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
            <Image
              source={require("../assets/images/cara.jpg")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Khora</Text>
      </View>
    </View>
  );
};

// 2. HEALTH SCORE CARD
const HealthScoreCard: React.FC = () => (
  <View style={styles.healthScoreCardContainer}>
    <Text style={styles.scoreTitle}>Health Score Dinâmico</Text>
    <View style={styles.scoreRow}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `75%` }]} />
      </View>
      <Text style={styles.scoreValue}>
        75<Text style={styles.scoreMax}>/100</Text>
      </Text>
    </View>
    <Text style={styles.scoreUpdateText}>Atualizado com suas atividades</Text>
  </View>
);

// 3. DAILY SUMMARY ITEM
const DailySummaryItem: React.FC<DailySummaryItemProps> = ({
  iconName,
  iconType,
  title,
  subtitle,
  color,
  iconBackground,
}) => {
  const IconComponent = iconType === "Ionicons" ? Icon : MaterialCommunityIcons;
  return (
    <TouchableOpacity style={styles.dailySummaryItem} activeOpacity={0.8}>
      <View
        style={[
          styles.dailySummaryIconCircle,
          { backgroundColor: iconBackground },
        ]}
      >
        <IconComponent name={iconName} size={24} color={color} />
      </View>
      <View style={styles.dailySummaryTextContainer}>
        <Text style={styles.dailySummaryTitle}>{title}</Text>
        <Text style={styles.dailySummarySubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

// 4. DAILY SUMMARY
const DailySummary: React.FC = () => (
  <View style={styles.dailySummaryContainer}>
    <DailySummaryItem
      iconName="calendar-outline"
      iconType="Ionicons"
      title="Check-up Anual"
      subtitle="Próximo exame em 30 dias"
      iconBackground={COLORS.iconBgBlue}
      color={COLORS.iconBlue}
    />
    <DailySummaryItem
      iconName="happy-outline"
      iconType="Ionicons"
      title="Humor"
      subtitle="Check-in de humor completo"
      iconBackground={COLORS.iconBgGreen}
      color={COLORS.iconGreen}
    />
  </View>
);

// 5. KNOWLEDGE PILL
const KnowledgePill: React.FC = () => (
  <View style={styles.knowledgePillContainer}>
    <Text style={styles.sectionTitle}>Pílula de Conhecimento</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.knowledgePillScrollContent}
    >
      <View style={{ marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity style={styles.knowledgePillCard} activeOpacity={0.9}>
          <View style={styles.knowledgePillImageContainer}>
            <Image
              source={require("../assets/images/tecnicas-sono.jpg")}
              style={styles.knowledgePillImage}
            />
          </View>
          <View style={styles.knowledgePillTextContent}>
            <Text style={[styles.knowledgePillTag, { color: COLORS.iconBlue }]}>
              Artigo
            </Text>
            <Text style={styles.knowledgePillTitle}>
              A importância do sono...
            </Text>
            <Text style={styles.knowledgePillDescription}>
              Descubra como o sono afeta seu bem-estar...
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity style={styles.knowledgePillCard} activeOpacity={0.9}>
          <View style={styles.knowledgePillImageContainer}>
            <Image
              source={require("../assets/images/exercicio-fisico.jpg")}
              style={styles.knowledgePillImage}
            />
          </View>
          <View style={styles.knowledgePillTextContent}>
            <Text style={[styles.knowledgePillTag, { color: COLORS.primary }]}>
              Vídeo
            </Text>
            <Text style={styles.knowledgePillTitle}>
              5 Exercícios essenciais...
            </Text>
            <Text style={styles.knowledgePillDescription}>
              Fortaleça seu corpo e melhore sua postura...
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

// 6. CUSTOM TAB BAR
const CustomTabBar: React.FC = () => (
  <View style={styles.tabBarContainer}>
    <TabBarItem iconName="home" label="Home" isFocused={true} />
    <TabBarItem
      iconName="shield-checkmark"
      label="Prevenção"
      isFocused={false}
    />
    <TabBarItem iconName="book" label="Conteúdo" isFocused={false} />
    <TabBarItem iconName="brain" label="Saúde Mental" isFocused={false} />
    <TabBarItem iconName="footsteps" label="Metas" isFocused={false} />
  </View>
);

// 7. TAB BAR ITEM
const TabBarItem: React.FC<TabBarItemProps> = ({
  iconName,
  label,
  isFocused,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const finalIconName = isFocused ? iconName : `${iconName}-outline`;
  const color = isFocused ? COLORS.primary : COLORS.textLight;

  const handlePress = () => {
    switch (label) {
      case "Home":
        navigation.navigate("Home");
        break;
      case "Prevenção":
        navigation.navigate("Prevenção");
        break;
      case "Conteúdo":
        navigation.navigate("Conteudo");
        break;
      case "Saúde Mental":
        navigation.navigate("SaudeMental");
        break;
      case "Metas":
        navigation.navigate("Metas");
        break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      style={styles.tabBarItem}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Icon name={finalIconName} size={24} color={color} />
      <Text
        style={[
          styles.tabBarLabel,
          { color: color, fontWeight: isFocused ? "600" : "400" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Componente Principal ---
export default function Home() {
  return (
    <View style={styles.mainContainer}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Seu Health Score</Text>
        <HealthScoreCard />

        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
        <DailySummary />

        <KnowledgePill />
      </ScrollView>
      <CustomTabBar />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 30,
  },
  headerContainer: {
    backgroundColor: COLORS.card,
    paddingTop: Platform.OS === "android" ? 45 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.title,
    textAlign: "center",
    flex: 1,
  },
  profileImageContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: COLORS.separator,
    position: "absolute",
    left: 5,
    top: "50%",
    transform: [{ translateY: -19 }],
  },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
    marginTop: 25,
  },
  healthScoreCardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scoreTitle: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "500",
    marginBottom: 10,
  },
  scoreRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  scoreValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginLeft: 10,
  },
  scoreMax: { fontSize: 14, color: COLORS.textLight, fontWeight: "400" },
  progressBarBackground: {
    flex: 1,
    height: 10, // deixei mais grossa
    backgroundColor: COLORS.separator,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  scoreUpdateText: { fontSize: 13, color: COLORS.textMedium, marginTop: 5 },
  dailySummaryContainer: { marginBottom: 0 },
  dailySummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dailySummaryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  dailySummaryTextContainer: { flex: 1, paddingRight: 10 },
  dailySummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  dailySummarySubtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginTop: 2,
  },
  knowledgePillContainer: { marginBottom: 20 },
  knowledgePillScrollContent: { paddingRight: 20, paddingBottom: 10 },
  knowledgePillCard: {
    width: width * 0.85,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  knowledgePillImageContainer: {
    height: 160,
    backgroundColor: COLORS.separator,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  knowledgePillImage: { width: "100%", height: "100%", resizeMode: "cover" },
  knowledgePillTextContent: { padding: 15 },
  knowledgePillTag: { fontSize: 13, fontWeight: "700", marginBottom: 5 },
  knowledgePillTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 5,
    lineHeight: 24,
  },
  knowledgePillDescription: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
  },
  tabBarItem: { flex: 1, alignItems: "center" },
  tabBarLabel: { fontSize: 11, marginTop: 4 },
});
