import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import type { ImageStyle } from "react-native";
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
  divider: "#F1F5F9", // Cinza Claro para divisores
};

// --- Componentes Reutilizáveis ---

// Componente para o Health Score
const HealthScoreCard = () => {
  const score = 75;
  const progressWidth = `${score}%`;

  return (
    <View style={scoreStyles.card}>
      {/* Wrapper para posicionar Título e Score na mesma linha */}
      <View style={scoreStyles.header}>
        <Text style={scoreStyles.title}>Health Score Dinâmico</Text>
        <Text style={scoreStyles.scoreText}>{score}/100</Text>
      </View>

      {/* Barra de Progresso Abaixo */}
      <View style={scoreStyles.progressBarBackground}>
        <View style={[scoreStyles.progressBarFill, { width: progressWidth }]} />
      </View>

      <Text style={scoreStyles.subtitle}>Atualizado com suas atividades</Text>
    </View>
  );
};

interface ResumoItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

// Componente para um item do Resumo do Dia
const ResumoItem: React.FC<ResumoItemProps> = ({
  iconName,
  title,
  subtitle,
}) => (
  <View style={resumoStyles.itemContainer}>
    <View style={resumoStyles.iconWrapper}>
      <Ionicons name={iconName} size={28} color={KHORA_COLORS.primary} />
    </View>
    <View style={resumoStyles.textWrapper}>
      <Text style={resumoStyles.title}>{title}</Text>
      <Text style={resumoStyles.subtitle}>{subtitle}</Text>
    </View>
  </View>
);

// --- TELA HOME PRINCIPAL ---

export default function Home() {
  const router = useRouter();

  // Função para simular a navegação do perfil
  const navigateToProfile = () => router.push("/perfil");

  // URL para a imagem placeholder do cabeçalho
  const profileImageUrl = "https://placehold.co/40x40/4A90E2/ffffff?text=U";
  // URL para a imagem placeholder da Pílula de Conhecimento
  const knowledgeImageUrl =
    "https://placehold.co/350x200/cccccc/333333?text=P%C3%ADlula+Conhecimento";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER (FIXO AGORA) --- */}
      <View style={styles.headerContainer}>
        {/* Foto e Título */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          {/* Imagem de Perfil (Placeholder) */}
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/cara.jpg")}
            alt="Imagem de Perfil"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khora</Text>
      </View>
      {/* --- FIM DO HEADER FIXO --- */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Health Score --- */}
        <Text style={styles.sectionTitle}>Seu Health Score</Text>
        <HealthScoreCard />

        {/* --- Resumo do Dia --- */}
        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
        <View style={resumoStyles.container}>
          <ResumoItem
            iconName="calendar-outline"
            title="Check-up Anual"
            subtitle="Próximo exame em 30 dias"
          />
          <View style={resumoStyles.divider} />
          <ResumoItem
            iconName="happy-outline"
            title="Humor"
            subtitle="Check-in de humor completo"
          />
        </View>

        {/* --- Pílula de Conhecimento --- */}
        <Text style={styles.sectionTitle}>Pílula de Conhecimento</Text>
        <TouchableOpacity style={knowledgeStyles.card} activeOpacity={0.8}>
          <Image
            // Se você quiser usar uma imagem local, DESCOMENTE a linha abaixo
            // e COMENTE a linha do 'uri' abaixo dela.
            // source={require("../assets/images/tecnicas-sono.jpg")}

            // Usamos { uri: knowledgeImageUrl } para que a pré-visualização funcione.
            source={require("../../assets/images/tecnicas-sono.jpg")}
            style={knowledgeStyles.image}
            alt="Placeholder de Artigo sobre Sono"
          />
          <View style={knowledgeStyles.textContainer}>
            <Text style={knowledgeStyles.articleTag}>Artigo</Text>
            <Text style={knowledgeStyles.title}>
              A importância do sono para a saúde mental
            </Text>
            <Text style={knowledgeStyles.description}>
              Descubra como o sono afeta seu bem-estar e dicas para melhorar seu
              descanso.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Espaçamento extra no final para a Tab Bar (que é separada) */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS GERAIS DA TELA ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KHORA_COLORS.divider, // Fundo levemente cinza
  },
  scrollContent: {
    paddingHorizontal: 25,
    // REMOVIDO: O padding superior, pois o header fixo já define o espaço
    paddingTop: 0,
    paddingBottom: 25,
  },
  headerContainer: {
    // ESTILOS PARA TORNAR O HEADER FIXO E COM BACKGROUND
    flexDirection: "row",
    alignItems: "center",
    // Cor de fundo explícita para cobrir o conteúdo que rola por baixo
    backgroundColor: KHORA_COLORS.divider,
    // Adiciona o padding horizontal que antes estava no ScrollView
    paddingHorizontal: 25,

    // AJUSTADO: Aumentado para 45 para garantir mais headroom no topo
    paddingTop: 45,

    // AJUSTADO: Reduzido para 15 para diminuir o espaço entre o header fixo e o conteúdo
    paddingBottom: 15,
    marginBottom: 0,
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KHORA_COLORS.primary,
    borderWidth: 1,
    borderColor: KHORA_COLORS.lightBlueBg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
    color: KHORA_COLORS.darkText,
    marginLeft: 94,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: KHORA_COLORS.darkText,
    marginBottom: 15,
    marginTop: 10,
  },
});

// --- ESTILOS DO HEALTH SCORE ---
const scoreStyles = StyleSheet.create({
  card: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    // Sombra mais proeminente e suave, como no design
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  // Estilo para alinhar Título e Score
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: KHORA_COLORS.darkText,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: KHORA_COLORS.divider,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: KHORA_COLORS.primary,
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: KHORA_COLORS.darkText,
  },
  subtitle: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
    marginTop: 10,
  },
});

// --- ESTILOS DO RESUMO DO DIA ---
const resumoStyles = StyleSheet.create({
  container: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconWrapper: {
    backgroundColor: KHORA_COLORS.lightBlueBg,
    // Arredondamento para parecer mais com o design
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: KHORA_COLORS.darkText,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: KHORA_COLORS.divider,
    marginVertical: 5,
    marginHorizontal: -15, // Estende a linha divisória
  },
});

// --- ESTILOS DA PÍLULA DE CONHECIMENTO ---
const knowledgeStyles = StyleSheet.create({
  card: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  } as ImageStyle,
  textContainer: {
    padding: 20,
  },
  articleTag: {
    fontSize: 14,
    fontWeight: "bold",
    color: KHORA_COLORS.primary,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: KHORA_COLORS.darkText,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: KHORA_COLORS.secondaryText,
    lineHeight: 24,
  },
});
