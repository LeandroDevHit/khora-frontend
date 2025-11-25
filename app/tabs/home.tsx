import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ImageStyle } from "react-native";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useUserContext } from "@/contexts/UserContext";
import { fetchNoticiasSaudeMasculina } from "@/services/api";
import { fetchCheckups } from "@/services/checkupService";
import { fetchHealthScore } from "@/services/userService";
import { fetchDailyMood, MoodEntry } from "@/services/wellBeingService";

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
        <View
          style={[scoreStyles.progressBarFill, { width: `${progress}%` }]}
        />
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

// Componente para um item do Resumo do Dia (agora pode ser clicável)
const ResumoItem: React.FC<ResumoItemProps & { onPress?: () => void }> = ({
  iconName,
  title,
  subtitle,
  color = KHORA_COLORS.primary,
  onPress,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={resumoStyles.itemContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[resumoStyles.iconWrapper, { backgroundColor: color + "22" }]}
      >
        <Ionicons name={iconName} size={28} color={color} />
      </View>
      <View style={resumoStyles.textWrapper}>
        <Text style={resumoStyles.title}>{String(title)}</Text>
        <Text style={resumoStyles.subtitle}>{String(subtitle)}</Text>
      </View>
    </Wrapper>
  );
};

type QuickAction = {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  background: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "habits",
    label: "Hábitos",
    subtitle: "Monitorar recaídas",
    icon: "leaf-outline",
    route: "/habitos",
    color: "#10B981",
    background: "#ECFDF5",
  },
  {
    id: "metas",
    label: "Metas",
    subtitle: "Evolução semanal",
    icon: "trending-up",
    route: "/tabs/metas",
    color: "#3B82F6",
    background: "#E0F2FE",
  },
  {
    id: "analise",
    label: "Check-in",
    subtitle: "Registrar humor",
    icon: "pulse",
    route: "/analiseEmocional",
    color: "#F97316",
    background: "#FFF7ED",
  },
  {
    id: "coach",
    label: "Coach",
    subtitle: "Falar agora",
    icon: "chatbubble-ellipses",
    route: "/chat",
    color: "#8B5CF6",
    background: "#F3E8FF",
  },
];

const moodVisualMap: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    label: string;
    description: string;
    emoji: string;
  }
> = {
  feliz: {
    icon: "happy-outline",
    color: "#4CAF50",
    label: "Feliz",
    description: "Alta energia e motivação",
    emoji: "😄",
  },
  bom: {
    icon: "thumbs-up-outline",
    color: "#3B82F6",
    label: "Bem",
    description: "Clima equilibrado",
    emoji: "🙂",
  },
  neutro: {
    icon: "remove-outline",
    color: "#94A3B8",
    label: "Neutro",
    description: "Estável, atento ao corpo",
    emoji: "😐",
  },
  ansioso: {
    icon: "alert-circle-outline",
    color: "#F59E0B",
    label: "Ansioso",
    description: "Respiração guiada recomendada",
    emoji: "😰",
  },
  triste: {
    icon: "sad-outline",
    color: "#6366F1",
    label: "Triste",
    description: "Reserve um tempo para você",
    emoji: "😔",
  },
  irritado: {
    icon: "thunderstorm-outline",
    color: "#EF4444",
    label: "Irritado",
    description: "Pratique pausas conscientes",
    emoji: "😤",
  },
  ruim: {
    icon: "cloud-outline",
    color: "#EF4444",
    label: "Difícil",
    description: "Conte com o time Khora",
    emoji: "😞",
  },
};

const getMoodVisual = (value?: string | null) => {
  if (!value) return moodVisualMap.neutro;
  return moodVisualMap[value.toLowerCase()] ?? moodVisualMap.neutro;
};

const normalizeMoodValue = (entry: any) =>
  entry?.mood ?? entry?.type ?? entry?.estado ?? "";

const normalizeMoodDate = (entry: any) =>
  entry?.createdAt ?? entry?.data ?? entry?.created_at ?? "";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDateLabel = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const formatFullDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};

// --- TELA HOME PRINCIPAL ---

export default function Home() {
  const router = useRouter();
  const { userName } = useUserContext();

  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [moodList, setMoodList] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [news, setNews] = useState<any | null>(null);
  const [exameMaisProximo, setExameMaisProximo] = useState<any | null>(null);

  const displayName = useMemo(
    () => (userName ? userName.split(" ")[0] : "Journey"),
    [userName]
  );

  const profileInitial = useMemo(() => {
    if (!displayName) return "K";
    return displayName.trim().charAt(0).toUpperCase() || "K";
  }, [displayName]);

  const navigateToProfile = useCallback(() => {
    router.push("/perfil");
  }, [router]);

  const loadHomeData = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      try {
        const [scoreData, moodData, examesRes] = await Promise.all([
          fetchHealthScore(),
          fetchDailyMood(),
          fetchCheckups(),
        ]);

        let score = 0;
        if (typeof scoreData === "number") {
          score = scoreData;
        } else if (
          scoreData &&
          typeof (scoreData as { score?: number }).score === "number"
        ) {
          score = (scoreData as { score: number }).score;
        }
        setHealthScore(score);

        setMoodList(Array.isArray(moodData) ? moodData : []);

        let examesArr = Array.isArray((examesRes as any)?.data)
          ? (examesRes as any).data
          : Array.isArray(examesRes)
          ? examesRes
          : [];

        examesArr = examesArr.filter((item: any) => !!item?.data_prevista);
        examesArr.sort(
          (a: any, b: any) =>
            new Date(a.data_prevista).getTime() -
            new Date(b.data_prevista).getTime()
        );

        const hoje = new Date();
        const exameProximo =
          examesArr.find((item: any) => new Date(item.data_prevista) >= hoje) ||
          examesArr[0] ||
          null;
        setExameMaisProximo(exameProximo ?? null);
      } catch (error) {
        console.warn("Erro ao carregar informações da home", error);
        if (mode === "initial") {
          setHealthScore((prev) => prev ?? 0);
          setMoodList([]);
          setExameMaisProximo(null);
        }
      } finally {
        if (mode === "initial") setLoading(false);
        if (mode === "refresh") setRefreshing(false);
      }
    },
    []
  );

  const loadNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const articles = await fetchNoticiasSaudeMasculina();
      if (Array.isArray(articles) && articles.length > 0) {
        setNews(articles[0]);
      } else {
        setNews(null);
        setNewsError("Nenhuma notícia encontrada.");
      }
    } catch (error) {
      console.warn("Erro ao buscar notícias", error);
      setNewsError("Erro ao buscar notícia.");
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
    loadNews();
  }, [loadHomeData, loadNews]);

  const onRefresh = useCallback(() => {
    Promise.allSettled([loadHomeData("refresh"), loadNews()]);
  }, [loadHomeData, loadNews]);

  const moodTodayEntry = useMemo(() => {
    const today = new Date();
    return moodList.find((entry) => {
      const entryDate = normalizeMoodDate(entry);
      if (!entryDate) return false;
      const parsed = new Date(entryDate);
      if (Number.isNaN(parsed.getTime())) return false;
      return isSameDay(today, parsed);
    });
  }, [moodList]);

  const moodHistory = useMemo(() => moodList.slice(0, 4), [moodList]);

  const moodSummaryMeta = moodTodayEntry
    ? getMoodVisual(normalizeMoodValue(moodTodayEntry))
    : null;

  const resumoItems = useMemo(() => {
    const items: Array<ResumoItemProps & { onPress?: () => void }> = [
      {
        iconName: "calendar-outline",
        title: "Check-up Anual",
        subtitle: exameMaisProximo?.data_prevista
          ? `Próximo exame: ${formatFullDate(exameMaisProximo.data_prevista)}`
          : "Nenhum exame encontrado",
        color: KHORA_COLORS.primary,
        onPress: () => router.push("/exames" as any),
      },
    ];

    if (moodSummaryMeta) {
      items.push({
        iconName: moodSummaryMeta.icon,
        title: moodSummaryMeta.label,
        subtitle: moodSummaryMeta.description,
        color: moodSummaryMeta.color,
      });
    } else {
      items.push({
        iconName: "happy-outline",
        title: "Humor",
        subtitle: "Faça seu check-in de humor",
        color: KHORA_COLORS.primary,
        onPress: () => router.push("/analiseEmocional" as any),
      });
    }

    return items;
  }, [exameMaisProximo, moodSummaryMeta, router]);

  const handleNewsPress = useCallback(() => {
    if (news?.url) {
      Linking.openURL(news.url);
    }
  }, [news?.url]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{profileInitial}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khora</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[KHORA_COLORS.primary]}
            tintColor={KHORA_COLORS.primary}
          />
        }
      >
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroGreeting}>Oi, {displayName}</Text>
            <Text style={styles.heroSubtitle}>
              Veja um panorama rápido da sua jornada hoje
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seu Health Score</Text>
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={KHORA_COLORS.primary} />
          </View>
        ) : (
          <HealthScoreCard score={healthScore ?? 0} />
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
        </View>
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.quickActionCard,
                { backgroundColor: action.background },
              ]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${action.color}22` },
                ]}
              >
                <Ionicons name={action.icon} size={20} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Resumo do Dia</Text>
          <TouchableOpacity onPress={() => router.push("/tabs/saude" as any)}>
            <Text style={styles.sectionAction}>Ver saúde</Text>
          </TouchableOpacity>
        </View>
        <View style={resumoStyles.container}>
          {resumoItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <ResumoItem
                iconName={item.iconName as keyof typeof Ionicons.glyphMap}
                title={item.title}
                subtitle={item.subtitle}
                color={item.color}
                onPress={item.onPress}
              />
              {idx < resumoItems.length - 1 && (
                <View style={resumoStyles.divider} />
              )}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Histórico emocional</Text>
          <TouchableOpacity onPress={() => router.push("/saude" as any)}>
            <Text style={styles.sectionAction}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator
            color={KHORA_COLORS.primary}
            style={{ marginVertical: 12 }}
          />
        ) : moodHistory.length ? (
          <View style={styles.moodHistoryList}>
            {moodHistory.map((entry) => {
              const meta = getMoodVisual(normalizeMoodValue(entry));
              return (
                <View key={entry.id} style={styles.moodHistoryChip}>
                  <Text style={styles.moodHistoryEmoji}>{meta.emoji}</Text>
                  <View>
                    <Text style={styles.moodHistoryLabel}>{meta.label}</Text>
                    <Text style={styles.moodHistoryDate}>
                      {formatDateLabel(normalizeMoodDate(entry))}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyStateText}>
            Registre seu humor para visualizar tendências.
          </Text>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Rotina de cuidados</Text>
          <TouchableOpacity onPress={() => router.push("/exames" as any)}>
            <Text style={styles.sectionAction}>Abrir agenda</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nextExamCard}>
          <View style={styles.nextExamIcon}>
            <Ionicons name="calendar" size={22} color={KHORA_COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextExamLabel}>
              {exameMaisProximo?.data_prevista
                ? formatFullDate(exameMaisProximo.data_prevista)
                : "Sem exames programados"}
            </Text>
            <Text style={styles.nextExamSubtitle}>
              {exameMaisProximo?.local ||
                exameMaisProximo?.descricao ||
                "Agende novos checkups para manter o ritmo"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pílula de Conhecimento</Text>
        {newsLoading ? (
          <ActivityIndicator
            color={KHORA_COLORS.primary}
            style={{ marginVertical: 12 }}
          />
        ) : newsError ? (
          <Text style={{ color: "red", marginVertical: 10 }}>{newsError}</Text>
        ) : news ? (
          <TouchableOpacity
            style={knowledgeStyles.card}
            activeOpacity={news?.url ? 0.85 : 1}
            onPress={handleNewsPress}
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
              <Text style={knowledgeStyles.description}>
                {news.description}
              </Text>
              <Text style={{ color: KHORA_COLORS.primary, marginTop: 6 }}>
                {news.source?.name}{" "}
                {!!news.publishedAt &&
                  `• ${new Date(news.publishedAt).toLocaleDateString()}`}
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
  heroCard: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
  },
  heroSubtitle: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
    marginTop: 6,
    maxWidth: 220,
  },
  heroButton: {
    backgroundColor: KHORA_COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
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
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sectionAction: {
    fontSize: 14,
    color: KHORA_COLORS.primary,
    fontWeight: "600",
  },
  loadingCard: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 15,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 10,
  },
  quickActionCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: KHORA_COLORS.secondaryText,
    marginTop: 2,
  },
  moodHistoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 10,
  },
  moodHistoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: KHORA_COLORS.divider,
  },
  moodHistoryEmoji: {
    fontSize: 22,
  },
  moodHistoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: KHORA_COLORS.darkText,
  },
  moodHistoryDate: {
    fontSize: 12,
    color: KHORA_COLORS.secondaryText,
  },
  emptyStateText: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
    marginBottom: 16,
  },
  nextExamCard: {
    backgroundColor: KHORA_COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: KHORA_COLORS.divider,
    marginBottom: 10,
  },
  nextExamIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: KHORA_COLORS.lightBlueBg,
    alignItems: "center",
    justifyContent: "center",
  },
  nextExamLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
  },
  nextExamSubtitle: {
    fontSize: 13,
    color: KHORA_COLORS.secondaryText,
    marginTop: 4,
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
