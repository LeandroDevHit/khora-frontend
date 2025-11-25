import api from "@/services/api";
import {
  fetchDailyMood,
  fetchPrevencao,
  fetchSaudeMental,
  BreathingExercise,
  MoodEntry,
  ReliefAudio,
} from "@/services/wellBeingService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Emocao {
  id: string;
  nome: string;
  emoji: string;
  descricao?: string;
}

interface Recurso {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  acao: string;
}

type LoadMode = "initial" | "refresh";

const EMOCOES_BASE: Emocao[] = [
  { id: "1", nome: "Feliz", emoji: "😄", descricao: "Alegre e satisfeito" },
  {
    id: "2",
    nome: "Triste",
    emoji: "😭",
    descricao: "Sentindo-se melancólico",
  },
  { id: "3", nome: "Ansioso", emoji: "😰", descricao: "Preocupado ou nervoso" },
  { id: "4", nome: "Calmo", emoji: "🙂", descricao: "Relaxado e tranquilo" },
  {
    id: "5",
    nome: "Irritado",
    emoji: "😤",
    descricao: "Frustrado ou irritável",
  },
  { id: "6", nome: "Neutro", emoji: "😐", descricao: "Indiferente ou neutro" },
];

const SUPPORT_RESOURCES: Recurso[] = [
  {
    id: "1",
    titulo: "Respiração Guiada",
    descricao: "Use nossos exercícios do backend para reduzir a ansiedade",
    icone: "fitness",
    acao: "Iniciar",
  },
  {
    id: "2",
    titulo: "Meditações Curtas",
    descricao: "Playlists com sons validados pelo time clínico",
    icone: "leaf",
    acao: "Explorar",
  },
  {
    id: "3",
    titulo: "Apoio Profissional",
    descricao: "Conecte-se com um especialista da rede Khora",
    icone: "help-circle",
    acao: "Contatar",
  },
];

const moodCatalog: Record<
  string,
  { label: string; emoji: string; description: string; color: string }
> = {
  feliz: {
    label: "Feliz",
    emoji: "😄",
    description: "Alta energia e motivação",
    color: "#34D399",
  },
  bom: {
    label: "Bem",
    emoji: "🙂",
    description: "Clima equilibrado e produtivo",
    color: "#60A5FA",
  },
  neutro: {
    label: "Neutro",
    emoji: "😐",
    description: "Estável, aberto a novas experiências",
    color: "#A1A1AA",
  },
  ansioso: {
    label: "Ansioso",
    emoji: "😰",
    description: "Tensão elevada — respire fundo",
    color: "#F59E0B",
  },
  triste: {
    label: "Triste",
    emoji: "😔",
    description: "Dedique tempo para autocuidado",
    color: "#64748B",
  },
  ruim: {
    label: "Difícil",
    emoji: "😞",
    description: "Conte conosco para atravessar o dia",
    color: "#EF4444",
  },
};

const getMoodConfig = (value?: string | null) => {
  if (!value) return moodCatalog.neutro;
  return moodCatalog[value.toLowerCase()] ?? moodCatalog.neutro;
};

const formatDateLabel = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const sanitizeBaseUrl = (url?: string | null) => {
  if (!url) return "";
  let sanitized = url.trim();
  if (sanitized.endsWith("/")) sanitized = sanitized.slice(0, -1);
  if (sanitized.endsWith("/api")) sanitized = sanitized.slice(0, -4);
  return sanitized;
};

export default function Saude() {
  const router = useRouter();
  const emocoes = EMOCOES_BASE;
  const [modalVisible, setModalVisible] = useState(false);
  const [emocaoSelecionada, setEmocaoSelecionada] = useState<Emocao | null>(
    null
  );
  const [audios, setAudios] = useState<ReliefAudio[]>([]);
  const [breathingExercises, setBreathingExercises] = useState<
    BreathingExercise[]
  >([]);
  const [selectedExercise, setSelectedExercise] =
    useState<BreathingExercise | null>(null);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const assetBaseUrl = useMemo(() => sanitizeBaseUrl(api.defaults.baseURL), []);

  const buildAudioUrl = useCallback(
    (src: string) => {
      if (!src) return "";
      if (src.startsWith("http")) return src;
      if (!assetBaseUrl) return src;
      const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
      return `${assetBaseUrl}${normalizedSrc}`;
    },
    [assetBaseUrl]
  );

  const loadHealthData = useCallback(async (mode: LoadMode = "initial") => {
    if (mode === "initial") setIsLoading(true);
    if (mode === "refresh") setRefreshing(true);

    try {
      const [audioData, breathingData, moodData] = await Promise.all([
        fetchSaudeMental(),
        fetchPrevencao(),
        fetchDailyMood(),
      ]);

      setAudios(Array.isArray(audioData) ? audioData : []);
      setBreathingExercises(Array.isArray(breathingData) ? breathingData : []);
      setMoodHistory(Array.isArray(moodData) ? moodData : []);
    } catch (error) {
      console.warn("Erro ao carregar saúde emocional", error);
      if (mode === "refresh") {
        Alert.alert(
          "Não foi possível atualizar",
          "Verifique sua conexão e tente novamente."
        );
      }
    } finally {
      if (mode === "initial") setIsLoading(false);
      if (mode === "refresh") setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  const handleEmocaoSelect = (emocao: Emocao) => {
    setEmocaoSelecionada(emocao);
    setModalVisible(true);
  };

  const handleRecursoPress = (recurso: Recurso) => {
    Alert.alert(
      recurso.titulo,
      `${recurso.descricao}\n\nEstamos sincronizando com o backend para habilitar esta ação.`
    );
  };

  const handleAudioPress = useCallback(
    async (audio: ReliefAudio) => {
      const url = buildAudioUrl(audio.src);
      if (!url) {
        Alert.alert("Não foi possível abrir", "Arquivo de áudio indisponível.");
        return;
      }

      try {
        await Linking.openURL(url);
      } catch (error) {
        Alert.alert(
          "Erro ao reproduzir",
          "Tente novamente em alguns instantes ou escolha outro áudio."
        );
      }
    },
    [buildAudioUrl]
  );

  const handleExercisePress = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalVisible(true);
  };

  const moodSummary = useMemo(() => {
    if (!moodHistory.length) return null;
    const latest = moodHistory[0];
    const config = getMoodConfig(latest.mood);
    return { ...config, createdAt: latest.createdAt };
  }, [moodHistory]);

  const moodHistorySlice = useMemo(
    () => moodHistory.slice(0, 6),
    [moodHistory]
  );

  const onRefresh = useCallback(
    () => loadHealthData("refresh"),
    [loadHealthData]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header com voltar */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.mainTitle}>Termômetro de Emoções</Text>
            <Text style={styles.subtitle}>
              Como você está se sentindo hoje?
            </Text>
          </View>
        </View>

        <View style={styles.moodOverviewCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionSubtitle}>Bem-estar emocional</Text>
              <Text style={styles.sectionTitle}>Acompanhamento diário</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/perfil" as any)}>
              <Text style={styles.sectionAction}>Ver perfil</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#3B82F6" style={{ marginVertical: 12 }} />
          ) : moodSummary ? (
            <View style={styles.moodHighlight}>
              <View
                style={[
                  styles.moodIcon,
                  { backgroundColor: moodSummary.color },
                ]}
              >
                <Text style={styles.moodIconEmoji}>{moodSummary.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.moodHighlightTitle}>
                  {moodSummary.label}
                </Text>
                <Text style={styles.moodHighlightDesc}>
                  {moodSummary.description}
                </Text>
                <Text style={styles.moodHighlightUpdated}>
                  Atualizado em {formatDateLabel(moodSummary.createdAt)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyStateText}>
              Registre seu humor para receber recomendações mais assertivas.
            </Text>
          )}
        </View>

        <View style={styles.moodHistorySection}>
          <Text style={styles.sectionTitle}>Histórico recente</Text>
          {isLoading ? (
            <ActivityIndicator color="#3B82F6" style={{ marginTop: 12 }} />
          ) : moodHistorySlice.length ? (
            <View style={styles.moodHistoryList}>
              {moodHistorySlice.map((entry) => {
                const config = getMoodConfig(entry.mood);
                return (
                  <View key={entry.id} style={styles.moodHistoryChip}>
                    <Text style={styles.moodHistoryEmoji}>{config.emoji}</Text>
                    <View>
                      <Text style={styles.moodHistoryLabel}>
                        {config.label}
                      </Text>
                      <Text style={styles.moodHistoryDate}>
                        {formatDateLabel(entry.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyStateText}>
              Ainda não há registros. Use o termômetro abaixo para começar.
            </Text>
          )}
        </View>

        {/* Grid de Emoções */}
        <View style={styles.emocionsContainer}>
          <View style={styles.emocionsRow}>
            {emocoes.slice(0, 3).map((emocao: Emocao) => (
              <TouchableOpacity
                key={emocao.id}
                style={styles.emocaoButton}
                onPress={() => handleEmocaoSelect(emocao)}
              >
                <Text style={styles.emoji}>{emocao.emoji}</Text>
                <Text style={styles.emocaoNome}>{emocao.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.emocionsRow}>
            {emocoes.slice(3, 6).map((emocao: Emocao) => (
              <TouchableOpacity
                key={emocao.id}
                style={styles.emocaoButton}
                onPress={() => handleEmocaoSelect(emocao)}
              >
                <Text style={styles.emoji}>{emocao.emoji}</Text>
                <Text style={styles.emocaoNome}>{emocao.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Análise Facial Card */}
        <View style={styles.analiseCard}>
          <View style={styles.analiseHeader}>
            <View style={styles.analiseIconContainer}>
              <Ionicons name="scan" size={24} color="#3B82F6" />
            </View>
            <View style={styles.analiseTextContainer}>
              <Text style={styles.analiseTitulo}>
                Análise Facial de Emoções
              </Text>
              <Text style={styles.analiseDesc}>
                Detectamos sua emoção para propor ajuda emocional rápida
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.escanearButton}
            onPress={() => router.push("/analiseEmocional")}
          >
            <Text style={styles.escanearButtonText}>Escanear</Text>
          </TouchableOpacity>
        </View>

        {/* Recursos de Apoio */}
        <View style={styles.recursosSection}>
          <Text style={styles.recursosTitle}>Recursos de Apoio</Text>

          {SUPPORT_RESOURCES.map((recurso) => (
            <TouchableOpacity
              key={recurso.id}
              style={styles.recursoItem}
              onPress={() => handleRecursoPress(recurso)}
            >
              <View style={styles.recursoIconContainer}>
                <Ionicons
                  name={recurso.icone as any}
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View style={styles.recursoContent}>
                <Text style={styles.recursoTitulo}>{recurso.titulo}</Text>
                <Text style={styles.recursoDesc}>{recurso.descricao}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Insights */}
        <TouchableOpacity style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <View style={styles.insightsIconContainer}>
              <Ionicons name="trending-up" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.insightsTitle}>Insights</Text>
              <Text style={styles.insightsDesc}>
                Veja estatísticas e padrões emocionais
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#3B82F6"
            style={styles.insightsArrow}
          />
        </TouchableOpacity>

        {/* Áudios e Meditações */}
        <View style={styles.audiosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.audioTitle}>Áudios e Meditações</Text>
            <TouchableOpacity onPress={() => router.push("/chat" as any)}>
              <Text style={styles.sectionAction}>Conversar com coach</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#3B82F6" style={{ marginTop: 12 }} />
          ) : audios.length ? (
            audios.map((audio) => (
              <TouchableOpacity
                key={audio.id}
                style={styles.audioCard}
                onPress={() => handleAudioPress(audio)}
              >
                <Ionicons name="volume-high" size={20} color="#3B82F6" />
                <View style={styles.audioContent}>
                  <Text style={styles.audioCardTitle}>{audio.title}</Text>
                  <Text style={styles.audioCardDesc}>{audio.description}</Text>
                  <View style={styles.audioMetaRow}>
                    <Text style={styles.audioDuration}>
                      {Math.round((audio.duration_seconds ?? 0) / 60)} min
                    </Text>
                    <Text style={styles.audioAction}>Ouvir agora</Text>
                  </View>
                </View>
                <Ionicons name="play-circle" size={22} color="#3B82F6" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyStateText}>
              Nenhum áudio cadastrado ainda. Tente novamente mais tarde.
            </Text>
          )}
        </View>

        <View style={styles.breathingSection}>
          <Text style={styles.sectionTitle}>Guias de Respiração</Text>
          {isLoading ? (
            <ActivityIndicator color="#3B82F6" style={{ marginTop: 12 }} />
          ) : breathingExercises.length ? (
            breathingExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.breathingCard}
                onPress={() => handleExercisePress(exercise)}
              >
                <View style={styles.breathingIcon}>
                  <Ionicons name="leaf" size={20} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.breathingTitle}>{exercise.name}</Text>
                  <Text style={styles.breathingDesc}>
                    {exercise.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyStateText}>
              Ainda não há protocolos cadastrados.
            </Text>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Modal de Emoção Selecionada */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Você selecionou</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.selectedEmoji}>
                {emocaoSelecionada?.emoji}
              </Text>
              <Text style={styles.selectedEmocao}>
                {emocaoSelecionada?.nome}
              </Text>
              <Text style={styles.selectedDesc}>
                {emocaoSelecionada?.descricao}
              </Text>

              <View style={styles.sugestoesContainer}>
                <Text style={styles.sugestoesTitle}>Sugestões para você:</Text>

                <TouchableOpacity style={styles.sugestaoButton}>
                  <Ionicons name="leaf" size={20} color="#10B981" />
                  <View style={styles.sugestaoContent}>
                    <Text style={styles.sugestaoBtnTitle}>Meditação</Text>
                    <Text style={styles.sugestaoBtnDesc}>
                      Uma sessão de 5 minutos
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sugestaoButton}>
                  <Ionicons name="fitness" size={20} color="#F59E0B" />
                  <View style={styles.sugestaoContent}>
                    <Text style={styles.sugestaoBtnTitle}>Exercício</Text>
                    <Text style={styles.sugestaoBtnDesc}>
                      Movimente o corpo agora
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sugestaoButton}>
                  <Ionicons name="help-circle" size={20} color="#3B82F6" />
                  <View style={styles.sugestaoContent}>
                    <Text style={styles.sugestaoBtnTitle}>Fale com alguém</Text>
                    <Text style={styles.sugestaoBtnDesc}>Abra seu coração</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal exercícios de respiração */}
      <Modal
        animationType="slide"
        transparent
        visible={isExerciseModalVisible}
        onRequestClose={() => setIsExerciseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.exerciseModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsExerciseModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Respiração guiada</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.selectedEmocao}>
                {selectedExercise?.name}
              </Text>
              <Text style={styles.selectedDesc}>
                {selectedExercise?.description}
              </Text>

              <View style={styles.sugestoesContainer}>
                <Text style={styles.sugestoesTitle}>
                  Passo a passo ({selectedExercise?.cycles ?? 0} ciclos)
                </Text>
                {selectedExercise?.steps?.map((step, index) => (
                  <View
                    key={`${step.step}-${index}`}
                    style={styles.exerciseStepRow}
                  >
                    <Text style={styles.exerciseStepTitle}>
                      {index + 1}. {step.step}
                    </Text>
                    <Text style={styles.exerciseStepDuration}>
                      {step.duration_seconds}s
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsExerciseModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionAction: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
  headerSection: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    marginTop: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  moodOverviewCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  moodHighlight: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    alignItems: "center",
  },
  moodIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  moodIconEmoji: {
    fontSize: 28,
  },
  moodHighlightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  moodHighlightDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  moodHighlightUpdated: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 6,
  },
  moodHistorySection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  moodHistoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  moodHistoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  moodHistoryEmoji: {
    fontSize: 20,
  },
  moodHistoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  moodHistoryDate: {
    fontSize: 11,
    color: "#94A3B8",
  },
  emocionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  emocionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  emocaoButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emocaoNome: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  analiseCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  analiseHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  analiseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  analiseTextContainer: {
    flex: 1,
  },
  analiseTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  analiseDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  escanearButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  escanearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  recursosSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  recursosTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  recursoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recursoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recursoContent: {
    flex: 1,
  },
  recursoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  recursoDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  insightsCard: {
    marginHorizontal: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  insightsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  insightsDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  insightsArrow: {
    marginLeft: 8,
  },
  audiosSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  audioContent: {
    flex: 1,
    marginLeft: 12,
  },
  audioCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  audioCardDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  audioMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  audioDuration: {
    fontSize: 12,
    color: "#6B7280",
  },
  audioAction: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
  breathingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  breathingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  breathingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  breathingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  breathingDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 12,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingTop: 16,
  },
  exerciseModalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  selectedEmoji: {
    fontSize: 64,
    textAlign: "center",
    marginBottom: 12,
  },
  selectedEmocao: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  selectedDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  sugestoesContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  sugestoesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  sugestaoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sugestaoContent: {
    flex: 1,
    marginLeft: 12,
  },
  sugestaoBtnTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  sugestaoBtnDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  exerciseStepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  exerciseStepTitle: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  exerciseStepDuration: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  closeButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});
