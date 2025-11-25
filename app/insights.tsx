import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getHabitoDetalhes,
  registrarRecaida,
  HabitoDetalhes,
} from "../services/habitoService";

const COLORS = {
  primary: "#3B82F6",
  primaryLight: "#DBEAFE",
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  background: "#F3F4F6",
  cardBg: "#FFFFFF",
  darkText: "#1F2937",
  secondaryText: "#6B7280",
  lightText: "#9CA3AF",
  divider: "#E5E7EB",
};

export default function Insights() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [habito, setHabito] = useState<HabitoDetalhes | null>(null);
  const [tempo, setTempo] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadHabitoData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const loadHabitoData = async () => {
    if (!id) {
      // Se não tiver ID, mostrar tela de seleção de hábito
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getHabitoDetalhes(id);
      if (data) {
        setHabito(data);
        setTempo(data.tempo);
        startTimer(data);
      } else {
        Alert.alert("Erro", "Hábito não encontrado");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar hábito:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (data: HabitoDetalhes) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let { dias, horas, minutos, segundos } = data.tempo;

    timerRef.current = setInterval(() => {
      segundos++;
      if (segundos >= 60) {
        segundos = 0;
        minutos++;
      }
      if (minutos >= 60) {
        minutos = 0;
        horas++;
      }
      if (horas >= 24) {
        horas = 0;
        dias++;
      }
      setTempo({ dias, horas, minutos, segundos });
    }, 1000);
  };

  const handleRecaida = async () => {
    if (!id) return;

    setRestarting(true);
    try {
      const result = await registrarRecaida(id);
      if (result.success) {
        Alert.alert("Tudo bem!", result.message, [
          { text: "OK", onPress: () => loadHabitoData() },
        ]);
      } else {
        Alert.alert("Erro", result.message);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar a recaída");
    } finally {
      setRestarting(false);
      setShowRestartModal(false);
    }
  };

  const getCategoriaIcon = (categoria?: string) => {
    switch (categoria?.toLowerCase()) {
      case "tabaco":
        return "leaf";
      case "alcool":
        return "wine";
      case "alimentacao":
        return "fast-food";
      case "exercicio":
        return "fitness";
      default:
        return "heart";
    }
  };

  const getMilestones = (diasLivres: number) => {
    const milestones = [
      { dias: 1, label: "1 dia livre", emoji: "🌱" },
      { dias: 3, label: "3 dias livres", emoji: "🌿" },
      { dias: 7, label: "1 semana livre", emoji: "⭐" },
      { dias: 14, label: "2 semanas livres", emoji: "🌟" },
      { dias: 30, label: "1 mês livre", emoji: "🏆" },
      { dias: 60, label: "2 meses livres", emoji: "💎" },
      { dias: 90, label: "3 meses livres", emoji: "👑" },
      { dias: 180, label: "6 meses livres", emoji: "🎖️" },
      { dias: 365, label: "1 ano livre!", emoji: "🏅" },
    ];

    return milestones.filter((m) => m.dias <= diasLivres).slice(-3);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!habito) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="fitness-outline" size={64} color={COLORS.primary} />
        <Text
          style={[
            styles.loadingText,
            { fontSize: 18, fontWeight: "600", marginTop: 16 },
          ]}
        >
          Superando Hábitos
        </Text>
        <Text
          style={[
            styles.loadingText,
            { textAlign: "center", paddingHorizontal: 40, marginTop: 8 },
          ]}
        >
          Para ver os detalhes de um hábito, selecione-o na página de Hábitos.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/habitos")}
        >
          <Text style={styles.backBtnText}>Ver Meus Hábitos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const milestones = getMilestones(tempo.dias);

  return (
    <View style={styles.bg}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.darkText} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.habitIcon,
                { backgroundColor: COLORS.primaryLight },
              ]}
            >
              <Ionicons
                name={getCategoriaIcon(habito.habito.categoria)}
                size={24}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.title}>{habito.habito.nome}</Text>
            {habito.metaPessoal && (
              <Text style={styles.metaText}>Meta: {habito.metaPessoal}</Text>
            )}
          </View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Progresso para 100 dias</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${habito.progressoPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>{habito.progressoPercent}%</Text>
        </View>

        {/* Contador de tempo */}
        <Text style={styles.sectionTitle}>Tempo sem o hábito</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>{tempo.dias}</Text>
            <Text style={styles.timeLabel}>Dias</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>
              {String(tempo.horas).padStart(2, "0")}
            </Text>
            <Text style={styles.timeLabel}>Horas</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>
              {String(tempo.minutos).padStart(2, "0")}
            </Text>
            <Text style={styles.timeLabel}>Minutos</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>
              {String(tempo.segundos).padStart(2, "0")}
            </Text>
            <Text style={styles.timeLabel}>Segundos</Text>
          </View>
        </View>

        {/* Economia */}
        {habito.custoDiario && habito.custoDiario > 0 && (
          <View style={styles.economiaCard}>
            <Ionicons name="wallet-outline" size={28} color={COLORS.success} />
            <View style={styles.economiaInfo}>
              <Text style={styles.economiaLabel}>Economia estimada</Text>
              <Text style={styles.economiaValue}>
                R$ {habito.economia.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Conquistas/Milestones */}
        <Text style={styles.sectionTitle}>Conquistas</Text>
        {milestones.length > 0 ? (
          <View style={styles.achievementsRow}>
            {milestones.map((m, idx) => (
              <View key={idx} style={styles.achievementBox}>
                <Text style={styles.achievementEmoji}>{m.emoji}</Text>
                <Text style={styles.achievementText}>{m.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyAchievements}>
            <Ionicons
              name="trophy-outline"
              size={32}
              color={COLORS.lightText}
            />
            <Text style={styles.emptyText}>
              Continue firme! Suas conquistas aparecerão aqui.
            </Text>
          </View>
        )}

        {/* Conquistas do backend */}
        {habito.conquistas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Suas Conquistas</Text>
            {habito.conquistas.map((c, idx) => (
              <View key={idx} style={styles.conquistaItem}>
                <Ionicons name="medal" size={24} color={COLORS.warning} />
                <View style={styles.conquistaInfo}>
                  <Text style={styles.conquistaNome}>{c.nome}</Text>
                  <Text style={styles.conquistaDesc}>{c.descricao}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Suporte Inteligente */}
        <Text style={styles.sectionTitle}>Suporte Inteligente</Text>
        <TouchableOpacity
          style={styles.supportBox}
          onPress={() => router.push("/chat")}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={28}
            color={COLORS.primary}
          />
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Assistente de Crise</Text>
            <Text style={styles.supportDesc}>
              Converse com nosso assistente para momentos difíceis.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
        </TouchableOpacity>

        {/* Recaída */}
        <View style={styles.relapseCard}>
          <Ionicons name="refresh-outline" size={24} color={COLORS.warning} />
          <View style={styles.relapseInfo}>
            <Text style={styles.relapseTitle}>Teve uma recaída?</Text>
            <Text style={styles.relapseDesc}>
              Não tem problema. Recomece sem julgamentos.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={() => setShowRestartModal(true)}
        >
          <Ionicons name="reload" size={20} color={COLORS.primary} />
          <Text style={styles.restartText}>Reiniciar contador</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de confirmação */}
      <Modal visible={showRestartModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="heart"
              size={48}
              color={COLORS.primary}
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.modalTitle}>Tudo bem, isso acontece</Text>
            <Text style={styles.modalDesc}>
              Recaídas fazem parte do processo. O importante é não desistir.
              Cada dia é uma nova oportunidade de recomeçar.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowRestartModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={handleRecaida}
                disabled={restarting}
              >
                {restarting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalBtnConfirmText}>Reiniciar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.secondaryText },
  backBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  backBtnText: { color: "#fff", fontWeight: "600" },

  header: { marginBottom: 20 },
  backButton: { marginBottom: 16 },
  headerContent: { alignItems: "center" },
  habitIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.darkText,
    textAlign: "center",
  },
  metaText: { fontSize: 14, color: COLORS.secondaryText, marginTop: 4 },

  progressCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  progressLabel: { fontSize: 14, color: COLORS.secondaryText, marginBottom: 8 },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.divider,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressPercent: {
    color: COLORS.primary,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.darkText,
    marginTop: 20,
    marginBottom: 12,
  },

  timeRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  timeBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  timeValue: { fontSize: 28, fontWeight: "800", color: COLORS.primary },
  timeLabel: { fontSize: 12, color: COLORS.secondaryText, marginTop: 4 },

  economiaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.successLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  economiaInfo: { flex: 1 },
  economiaLabel: { fontSize: 13, color: COLORS.success },
  economiaValue: { fontSize: 24, fontWeight: "800", color: COLORS.success },

  achievementsRow: { flexDirection: "row", gap: 10 },
  achievementBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  achievementEmoji: { fontSize: 28, marginBottom: 6 },
  achievementText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    textAlign: "center",
  },

  emptyAchievements: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.lightText,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },

  conquistaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  conquistaInfo: { flex: 1 },
  conquistaNome: { fontSize: 15, fontWeight: "600", color: COLORS.darkText },
  conquistaDesc: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },

  supportBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  supportInfo: { flex: 1 },
  supportTitle: { fontWeight: "700", color: COLORS.primary, fontSize: 15 },
  supportDesc: { color: COLORS.secondaryText, fontSize: 12, marginTop: 2 },

  relapseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warningLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  relapseInfo: { flex: 1 },
  relapseTitle: { fontWeight: "700", color: COLORS.warning, fontSize: 15 },
  relapseDesc: { color: COLORS.secondaryText, fontSize: 12, marginTop: 2 },

  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  restartText: { color: COLORS.primary, fontWeight: "600", fontSize: 15 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.darkText,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: { flexDirection: "row", gap: 12, width: "100%" },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  modalBtnCancelText: {
    color: COLORS.secondaryText,
    fontWeight: "600",
    fontSize: 15,
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  modalBtnConfirmText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
