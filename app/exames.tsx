import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateInput from "../components/DateInput";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  fetchCheckups,
  createCheckup,
  updateCheckup,
  deleteCheckup,
} from "@/services/checkupService";

const KHORA_COLORS = {
  primary: "#377DFF",
  background: "#F2F6FF",
  card: "#FFFFFF",
  textDark: "#1F2937",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  success: "#0EA5E9",
  warning: "#F59E0B",
  alert: "#EF4444",
};

const STATUS_VARIANTS: Record<
  string,
  { color: string; background: string; label: string }
> = {
  realizado: {
    color: "#16A34A",
    background: "rgba(22,163,74,0.12)",
    label: "Realizado",
  },
  pendente: {
    color: "#F97316",
    background: "rgba(249,115,22,0.12)",
    label: "Pendente",
  },
  agendado: {
    color: "#2563EB",
    background: "rgba(37,99,235,0.12)",
    label: "Agendado",
  },
};

const getStatusVariant = (status?: string | null) => {
  const key = status?.toLowerCase() ?? "";
  return (
    STATUS_VARIANTS[key] ?? {
      color: KHORA_COLORS.textDark,
      background: "rgba(15,23,42,0.06)",
      label: status || "Sem status",
    }
  );
};

const formatDateToBR = (value?: string | null) => {
  if (!value) return "Sem data";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Sem data";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sanitizeInputDate = (value: string) => {
  const parts = value.split("/");
  if (parts.length !== 3) return null;
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
    2,
    "0"
  )}`;
};

export default function Exames() {
  const router = useRouter();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarExames() {
    setLoading(true);
    try {
      const res: any = await fetchCheckups();
      setExames(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setExames([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarExames();
  }, []);

  const sortedExams = useMemo(() => {
    return [...exames].sort((a, b) => {
      const dateA = new Date(a?.data_prevista ?? 0).getTime();
      const dateB = new Date(b?.data_prevista ?? 0).getTime();
      return dateA - dateB;
    });
  }, [exames]);

  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let upcoming = 0;
    let pending = 0;
    const withDate = [] as any[];

    exames.forEach((exam) => {
      const statusKey = exam?.status?.toLowerCase();
      if (statusKey === "pendente" || statusKey === "agendado") pending += 1;

      const date = exam?.data_prevista ? new Date(exam.data_prevista) : null;
      if (date && !Number.isNaN(date.getTime())) {
        withDate.push(exam);
        if (date >= today) upcoming += 1;
      }
    });

    const nextExam = withDate
      .sort(
        (a, b) =>
          new Date(a.data_prevista).getTime() -
          new Date(b.data_prevista).getTime()
      )
      .find((exam) => new Date(exam.data_prevista) >= today);

    return {
      total: exames.length,
      upcoming,
      pending,
      nextExam: nextExam ?? withDate[0] ?? null,
    };
  }, [exames]);

  async function handleAddExame() {
    if (!novoNome || !novaData) {
      Alert.alert("Preencha o nome e a data do exame.");
      return;
    }

    const dataISO = sanitizeInputDate(novaData);
    if (!dataISO) {
      Alert.alert("Data inválida. Use o formato dd/mm/aaaa.");
      return;
    }

    const dataSelecionada = new Date(dataISO);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      Alert.alert("A data não pode ser anterior à data de hoje.");
      return;
    }

    try {
      const payload = {
        nome: novoNome,
        data_prevista: dataISO,
        status: novoStatus,
      };

      if (editandoId !== null) {
        await updateCheckup(editandoId.toString(), payload);
      } else {
        await createCheckup(payload);
      }

      fecharModal();
      await carregarExames();
    } catch (e) {
      Alert.alert(
        editandoId !== null
          ? "Erro ao editar exame."
          : "Erro ao adicionar exame."
      );
    }
  }

  function abrirModalCriacao() {
    setModalVisible(true);
    setEditandoId(null);
    setNovoNome("");
    setNovaData("");
    setNovoStatus("");
  }

  function fecharModal() {
    setModalVisible(false);
    setEditandoId(null);
    setNovoNome("");
    setNovaData("");
    setNovoStatus("");
  }

  function handleEditarExame(exame: any) {
    setNovoNome(exame.nome);
    setNovaData(
      exame.data_prevista
        ? new Date(exame.data_prevista).toLocaleDateString("pt-BR")
        : ""
    );
    setNovoStatus(exame.status || "");
    setEditandoId(exame.id);
    setModalVisible(true);
  }

  async function handleApagarExame(id: number) {
    Alert.alert("Apagar exame", "Tem certeza que deseja apagar este exame?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCheckup(id.toString());
            await carregarExames();
          } catch (e) {
            Alert.alert("Erro ao apagar exame.");
          }
        },
      },
    ]);
  }

  const renderExamItem = ({ item }: { item: any }) => {
    const statusVariant = getStatusVariant(item?.status);
    return (
      <View style={styles.examCard}>
        <View style={styles.examHeader}>
          <View style={styles.examIconWrapper}>
            <Ionicons
              name={item?.icon ?? "medkit-outline"}
              size={26}
              color={KHORA_COLORS.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.examName}>{item?.nome}</Text>
            <Text style={styles.examMeta}>
              {item?.local || item?.descricao || "Checagem clínica"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleEditarExame(item)}
            style={styles.iconButton}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={KHORA_COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.examDetailsRow}>
          <View style={styles.detailPill}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={KHORA_COLORS.primary}
            />
            <Text style={styles.detailText}>
              {formatDateToBR(item?.data_prevista)}
            </Text>
          </View>
          <View style={styles.detailPill}>
            <Ionicons
              name="location-outline"
              size={16}
              color={KHORA_COLORS.primary}
            />
            <Text style={styles.detailText}>{item?.local || "Sem local"}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusVariant.background },
            ]}
          >
            <Text
              style={[styles.statusBadgeText, { color: statusVariant.color }]}
            >
              {statusVariant.label}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleApagarExame(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={KHORA_COLORS.alert}
            />
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push("/tabs/prevencao" as any)}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={KHORA_COLORS.primary}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Meus exames</Text>
            <Text style={styles.screenSubtitle}>
              Organize seus checkups e mantenha a agenda em dia
            </Text>
          </View>
          <TouchableOpacity
            style={styles.primaryCircleButton}
            onPress={abrirModalCriacao}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Exames agendados</Text>
            <Text style={styles.metricValue}>{metrics.total}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Próximos</Text>
            <Text style={styles.metricValue}>{metrics.upcoming}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pendentes</Text>
            <Text style={[styles.metricValue, { color: KHORA_COLORS.warning }]}>
              {metrics.pending}
            </Text>
          </View>
        </View>

        {metrics.nextExam ? (
          <View style={styles.highlightCard}>
            <View>
              <Text style={styles.highlightTitle}>Próximo exame</Text>
              <Text style={styles.highlightName}>{metrics.nextExam.nome}</Text>
              <Text style={styles.highlightDate}>
                {formatDateToBR(metrics.nextExam.data_prevista)} •{" "}
                {metrics.nextExam.local || "Local a definir"}
              </Text>
            </View>
            <Ionicons name="alarm-outline" size={26} color="#fff" />
          </View>
        ) : null}

        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={KHORA_COLORS.primary}
          />
          <Text style={styles.addButtonText}>Adicionar novo exame</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            color={KHORA_COLORS.primary}
            style={{ marginTop: 32 }}
          />
        ) : sortedExams.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={40}
              color={KHORA_COLORS.primary}
            />
            <Text style={styles.emptyTitle}>Nenhum exame cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Cadastre seus próximos exames para receber lembretes e manter o
              acompanhamento.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={abrirModalCriacao}
            >
              <Text style={styles.emptyButtonText}>Criar primeiro exame</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sortedExams}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderExamItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 48 }}
          />
        )}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={fecharModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editandoId ? "Editar exame" : "Novo exame"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do exame"
                value={novoNome}
                onChangeText={setNovoNome}
              />
              <DateInput value={novaData} onChange={setNovaData} />
              <TextInput
                style={styles.input}
                placeholder="Status (Agendado, Pendente...)"
                value={novoStatus}
                onChangeText={setNovoStatus}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={fecharModal}
                >
                  <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleAddExame}
                >
                  <Text style={styles.primaryButtonText}>
                    {editandoId ? "Salvar alterações" : "Salvar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KHORA_COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: KHORA_COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: KHORA_COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: KHORA_COLORS.textDark,
  },
  screenSubtitle: {
    fontSize: 14,
    color: KHORA_COLORS.textMuted,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: KHORA_COLORS.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: KHORA_COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: KHORA_COLORS.textDark,
    marginTop: 6,
  },
  highlightCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: KHORA_COLORS.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  highlightTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  highlightName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 6,
  },
  highlightDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: KHORA_COLORS.card,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: KHORA_COLORS.border,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: KHORA_COLORS.primary,
  },
  examCard: {
    backgroundColor: KHORA_COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  examIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: KHORA_COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  examName: {
    fontSize: 17,
    fontWeight: "700",
    color: KHORA_COLORS.textDark,
  },
  examMeta: {
    fontSize: 13,
    color: KHORA_COLORS.textMuted,
    marginTop: 3,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: KHORA_COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  examDetailsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  detailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: KHORA_COLORS.background,
  },
  detailText: {
    fontSize: 13,
    color: KHORA_COLORS.textDark,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: KHORA_COLORS.alert,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: KHORA_COLORS.card,
    borderRadius: 20,
    padding: 32,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: KHORA_COLORS.textDark,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: KHORA_COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: KHORA_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: KHORA_COLORS.textDark,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: KHORA_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: KHORA_COLORS.textDark,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: KHORA_COLORS.background,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: KHORA_COLORS.textDark,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: KHORA_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
