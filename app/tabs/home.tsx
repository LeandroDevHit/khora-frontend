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

import { fetchHealthScore } from "@/services/userService";
import { fetchDailyMood } from "@/services/wellBeingService";
import { useEffect, useState } from "react";

// Componente para o Health Score
const HealthScoreCard = ({ score }: { score: number }) => {
  // Garante que o valor fique entre 0 e 100
  const progress = Math.max(0, Math.min(score, 100));
  return (
    <View style={scoreStyles.card}>
      <View style={scoreStyles.header}>
        <Text style={scoreStyles.title}>Health Score Dinâmico</Text>
        <Text style={scoreStyles.scoreText}>{progress}/100</Text>
      </View>
      <View style={scoreStyles.progressBarBackground}>
        <View style={[scoreStyles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={scoreStyles.subtitle}>Atualizado com suas atividades</Text>
    </View>
  );
};

interface ResumoItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color?: string;
}

// Função para definir ícone e cor conforme tipo de humor
function getMoodIconAndColor(type: string): { icon: keyof typeof Ionicons.glyphMap; color: string } {
  switch (type?.toLowerCase()) {
    case "feliz":
      return { icon: "happy-outline", color: "#4CAF50" };
    case "triste":
      return { icon: "sad-outline", color: "#2196F3" };
    case "ansioso":
      return { icon: "alert-circle-outline", color: "#FF9800" };
    case "irritado":
      return { icon: "thunderstorm-outline", color: "#F44336" };
    default:
      return { icon: "happy-outline", color: KHORA_COLORS.primary };
  }
}

// Componente para um item do Resumo do Dia
const ResumoItem: React.FC<ResumoItemProps> = ({
  iconName,
  title,
  subtitle,
  color = KHORA_COLORS.primary,
}) => (
  <View style={resumoStyles.itemContainer}>
    <View style={[resumoStyles.iconWrapper, { backgroundColor: color + "22" }]}> 
      <Ionicons name={iconName} size={28} color={color} />
    </View>
    <View style={resumoStyles.textWrapper}>
      <Text style={resumoStyles.title}>{String(title)}</Text>
      <Text style={resumoStyles.subtitle}>{String(subtitle)}</Text>
    </View>
  </View>
);

// --- TELA HOME PRINCIPAL ---

export default function Home() {
  const router = useRouter();
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [moodList, setMoodList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [news, setNews] = useState<any>(null);

  const navigateToProfile = () => router.push("/perfil");

  useEffect(() => {
    async function fetchData() {
      try {
        const scoreData = await fetchHealthScore();
        let score = 0;
        if (typeof scoreData === "number") {
          score = scoreData;
        } else if (scoreData && typeof (scoreData as { score?: number }).score === "number") {
          score = (scoreData as { score: number }).score;
        }
        setHealthScore(score);
        const moodData = await fetchDailyMood();
        setMoodList(Array.isArray(moodData) ? moodData : []);
      } catch (err) {
        setHealthScore(0);
        setMoodList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Fetch GNews
    async function fetchNews() {
      try {
        setNewsLoading(true);
        setNewsError(null);
        const res = await fetch("https://gnews.io/api/v4/search?q=saúde%20masculina&lang=pt&max=10&token=dcf10bde187ec1bda0c4b4e62c708bc3");
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setNews(data.articles[0]);
        } else {
          setNewsError("Nenhuma notícia encontrada.");
        }
      } catch (err) {
        setNewsError("Erro ao buscar notícia.");
      } finally {
        setNewsLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Mapeamento dos moods para o resumo, ajustando ícone/cor
  const resumoItems = moodList.length > 0
    ? moodList.slice(0, 2).map((mood, idx) => {
        const { icon, color } = getMoodIconAndColor(mood.type);
        return {
          iconName: icon,
          title: mood.type || "Humor",
          subtitle: mood.description || "Check-in de humor completo",
          color,
        };
      })
    : [
        {
          iconName: "calendar-outline",
          title: "Check-up Anual",
          subtitle: "Próximo exame em 30 dias",
          color: KHORA_COLORS.primary,
        },
        {
          iconName: "happy-outline",
          title: "Humor",
          subtitle: "Check-in de humor completo",
          color: KHORA_COLORS.primary,
        },
      ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          <Image
            style={styles.profileImage}
            source={require("../../assets/images/cara.jpg")}
            alt="Imagem de Perfil"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khora</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Seu Health Score</Text>
        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <HealthScoreCard score={healthScore ?? 0} />
        )}

        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
        <View style={resumoStyles.container}>
          {resumoItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <ResumoItem
                iconName={item.iconName as keyof typeof Ionicons.glyphMap}
                title={item.title}
                subtitle={item.subtitle}
                color={item.color}
              />
              {idx < resumoItems.length - 1 && <View style={resumoStyles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pílula de Conhecimento</Text>
        {newsLoading ? (
          <Text style={{ marginVertical: 10 }}>Carregando notícia...</Text>
        ) : newsError ? (
          <Text style={{ color: 'red', marginVertical: 10 }}>{newsError}</Text>
        ) : news ? (
          <TouchableOpacity
            style={knowledgeStyles.card}
            activeOpacity={0.8}
            onPress={() => {
              if (news.url) {
                // Abrir link externo
              }
            }}
          >
            {news.image ? (
              <Image
                source={{ uri: news.image }}
                style={knowledgeStyles.image}
                resizeMode="cover"
              />
            ) : null}
            <View style={knowledgeStyles.textContainer}>
              <Text style={knowledgeStyles.articleTag}>Artigo</Text>
              <Text style={knowledgeStyles.title}>{news.title}</Text>
              <Text style={knowledgeStyles.description}>{news.description}</Text>
              <Text style={{ color: '#3b82f6', marginTop: 6 }}>
                {news.source?.name} {!!news.publishedAt && `• ${new Date(news.publishedAt).toLocaleDateString()}`}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
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
