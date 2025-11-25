import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchDashboard } from "../services/metaService";
import {
  listarHabitos,
  adicionarHabito,
  Habito,
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
  purple: "#8B5CF6",
  purpleLight: "#EDE9FE",
  background: "#F3F4F6",
  cardBg: "#FFFFFF",
  darkText: "#1F2937",
  secondaryText: "#6B7280",
  lightText: "#9CA3AF",
  divider: "#E5E7EB",
};

interface HabitoAtivo {
  id: string;
  nome: string;
  categoria: string | null;
  dataInicio: string;
  ultimaRecaida: string | null;
  metaPessoal: string | null;
  custoDiario: number | null;
  diasLivres: number;
}

export default function HabitosScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dados
  const [habitosAtivos, setHabitosAtivos] = useState<HabitoAtivo[]>([]);
  const [habitosDisponiveis, setHabitosDisponiveis] = useState<Habito[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    semRecaida: 0,
    economiaTotal: 0,
  });

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabito, setSelectedHabito] = useState<Habito | null>(null);
  const [metaPessoal, setMetaPessoal] = useState("");
  const [custoDiario, setCustoDiario] = useState("");
  const [adding, setAdding] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Carregar dashboard com hábitos ativos
      const dashboard = await fetchDashboard();
      if (dashboard?.habitos) {
        setHabitosAtivos(dashboard.habitos.habitosAtivos || []);
        setEstatisticas({
          total: dashboard.habitos.estatisticas?.total || 0,
          semRecaida: dashboard.habitos.estatisticas?.semRecaida || 0,
          economiaTotal: dashboard.habitos.estatisticas?.economiaTotal || 0,
        });
      }

      // Carregar hábitos disponíveis para adicionar
      const disponiveis = await listarHabitos();
      setHabitosDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao carregar hábitos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getCategoriaConfig = (categoria?: string | null) => {
    switch (categoria?.toLowerCase()) {
      case "tabaco":
        return {
          icon: "leaf",
          color: COLORS.success,
          bg: COLORS.successLight,
          label: "Tabaco",
        };
      case "alcool":
        return {
          icon: "wine",
          color: COLORS.purple,
          bg: COLORS.purpleLight,
          label: "Álcool",
        };
      case "alimentacao":
        return {
          icon: "fast-food",
          color: COLORS.warning,
          bg: COLORS.warningLight,
          label: "Alimentação",
        };
      case "drogas":
        return {
          icon: "medical",
          color: COLORS.danger,
          bg: COLORS.dangerLight,
          label: "Substâncias",
        };
      case "jogos":
        return {
          icon: "game-controller",
          color: COLORS.primary,
          bg: COLORS.primaryLight,
          label: "Jogos",
        };
      case "tecnologia":
        return {
          icon: "phone-portrait",
          color: COLORS.purple,
          bg: COLORS.purpleLight,
          label: "Tecnologia",
        };
      case "vicio":
        return {
          icon: "ban",
          color: COLORS.danger,
          bg: COLORS.dangerLight,
          label: "Vício",
        };
      default:
        return {
          icon: "heart",
          color: COLORS.primary,
          bg: COLORS.primaryLight,
          label: "Outros",
        };
    }
  };

  const handleAddHabito = (habito: Habito) => {
    // Verificar se já está acompanhando
    const jaAcompanhando = habitosAtivos.some((h) => h.nome === habito.nome);
    if (jaAcompanhando) {
      Alert.alert("Atenção", "Você já está acompanhando este hábito.");
      return;
    }

    setSelectedHabito(habito);
    setMetaPessoal("");
    setCustoDiario("");
    setShowAddModal(true);
  };

  const confirmAddHabito = async () => {
    if (!selectedHabito) return;

    setAdding(true);
    try {
      const result = await adicionarHabito(
        selectedHabito.id,
        metaPessoal || undefined,
        custoDiario ? parseFloat(custoDiario) : undefined
      );

      if (result.success) {
        Alert.alert("Sucesso!", result.message);
        setShowAddModal(false);
        loadData(); // Recarregar dados
      } else {
        Alert.alert("Erro", result.message);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o hábito");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando hábitos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.darkText} />
          </TouchableOpacity>
          <Text style={styles.title}>Superando Vícios</Text>
          <Text style={styles.subtitle}>
            Acompanhe sua jornada de superação e celebre cada conquista
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: COLORS.primaryLight },
              ]}
            >
              <Ionicons name="fitness" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{estatisticas.total}</Text>
            <Text style={styles.statLabel}>Hábitos</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: COLORS.successLight },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.success}
              />
            </View>
            <Text style={styles.statValue}>{estatisticas.semRecaida}</Text>
            <Text style={styles.statLabel}>Sem recaída</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: COLORS.warningLight },
              ]}
            >
              <Ionicons name="wallet" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.statValue}>
              R$ {estatisticas.economiaTotal.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Economia</Text>
          </View>
        </View>

        {/* Hábitos Ativos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus Hábitos em Superação</Text>

          {habitosAtivos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="leaf-outline"
                size={48}
                color={COLORS.lightText}
              />
              <Text style={styles.emptyTitle}>Nenhum hábito ainda</Text>
              <Text style={styles.emptyText}>
                Adicione um hábito que deseja superar e comece sua jornada de
                transformação.
              </Text>
            </View>
          ) : (
            habitosAtivos.map((habito) => {
              const config = getCategoriaConfig(habito.categoria);
              return (
                <TouchableOpacity
                  key={habito.id}
                  style={styles.habitoCard}
                  onPress={() =>
                    router.push({
                      pathname: "/insights",
                      params: { id: habito.id },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.habitoMain}>
                    <View
                      style={[
                        styles.habitoIcon,
                        { backgroundColor: config.bg },
                      ]}
                    >
                      <Ionicons
                        name={config.icon as any}
                        size={24}
                        color={config.color}
                      />
                    </View>
                    <View style={styles.habitoInfo}>
                      <Text style={styles.habitoNome}>{habito.nome}</Text>
                      <Text style={styles.habitoMeta}>
                        {habito.metaPessoal ||
                          `Desde ${formatDate(habito.dataInicio)}`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.habitoStats}>
                    <View style={styles.diasBadge}>
                      <Text style={styles.diasNum}>{habito.diasLivres}</Text>
                      <Text style={styles.diasLabel}>dias</Text>
                    </View>
                    {habito.custoDiario && habito.custoDiario > 0 && (
                      <Text style={styles.economiaText}>
                        R$ {(habito.custoDiario * habito.diasLivres).toFixed(0)}{" "}
                        economizados
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.lightText}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Adicionar Novo Hábito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionar Hábito</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha um hábito que deseja abandonar
          </Text>

          <View style={styles.habitosGrid}>
            {habitosDisponiveis.map((habito) => {
              const config = getCategoriaConfig(habito.categoria);
              const jaAcompanhando = habitosAtivos.some(
                (h) => h.nome === habito.nome
              );

              return (
                <TouchableOpacity
                  key={habito.id}
                  style={[
                    styles.addHabitoCard,
                    jaAcompanhando && styles.addHabitoCardDisabled,
                  ]}
                  onPress={() => handleAddHabito(habito)}
                  disabled={jaAcompanhando}
                >
                  <View
                    style={[
                      styles.addHabitoIcon,
                      { backgroundColor: config.bg },
                    ]}
                  >
                    <Ionicons
                      name={config.icon as any}
                      size={28}
                      color={config.color}
                    />
                  </View>
                  <Text style={styles.addHabitoNome}>{habito.nome}</Text>
                  {jaAcompanhando && (
                    <View style={styles.jaAdicionadoBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.success}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {habitosDisponiveis.length === 0 && (
            <View style={styles.emptySmall}>
              <Text style={styles.emptyText}>
                Nenhum hábito disponível no momento
              </Text>
            </View>
          )}
        </View>

        {/* Dica */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={COLORS.warning} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica</Text>
            <Text style={styles.tipText}>
              Cada dia conta! Mesmo que tenha uma recaída, não desista. O
              importante é recomeçar e continuar tentando.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal para adicionar hábito */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Hábito</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>

            {selectedHabito && (
              <>
                <View style={styles.selectedHabito}>
                  <View
                    style={[
                      styles.selectedIcon,
                      {
                        backgroundColor: getCategoriaConfig(
                          selectedHabito.categoria
                        ).bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        getCategoriaConfig(selectedHabito.categoria).icon as any
                      }
                      size={32}
                      color={getCategoriaConfig(selectedHabito.categoria).color}
                    />
                  </View>
                  <Text style={styles.selectedNome}>{selectedHabito.nome}</Text>
                  {selectedHabito.descricao && (
                    <Text style={styles.selectedDesc}>
                      {selectedHabito.descricao}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Meta pessoal (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Ficar 30 dias livre"
                    placeholderTextColor={COLORS.lightText}
                    value={metaPessoal}
                    onChangeText={setMetaPessoal}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Quanto gastava por dia? (R$)
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 15.00"
                    placeholderTextColor={COLORS.lightText}
                    keyboardType="decimal-pad"
                    value={custoDiario}
                    onChangeText={setCustoDiario}
                  />
                  <Text style={styles.inputHelper}>
                    Isso ajuda a calcular sua economia
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={confirmAddHabito}
                    disabled={adding}
                  >
                    {adding ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.confirmBtnText}>Adicionar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.secondaryText },

  // Header
  header: { marginBottom: 24 },
  backBtn: { marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.darkText,
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: COLORS.secondaryText, lineHeight: 22 },

  // Stats
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.darkText },
  statLabel: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2 },

  // Section
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.darkText,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 16,
  },

  // Empty state
  emptyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkText,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  emptySmall: { padding: 24, alignItems: "center" },

  // Habito Card
  habitoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  habitoMain: { flex: 1, flexDirection: "row", alignItems: "center" },
  habitoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  habitoInfo: { marginLeft: 12, flex: 1 },
  habitoNome: { fontSize: 16, fontWeight: "600", color: COLORS.darkText },
  habitoMeta: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },
  habitoStats: { alignItems: "flex-end", marginRight: 8 },
  diasBadge: {
    alignItems: "center",
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  diasNum: { fontSize: 18, fontWeight: "800", color: COLORS.success },
  diasLabel: { fontSize: 10, color: COLORS.success, fontWeight: "500" },
  economiaText: {
    fontSize: 11,
    color: COLORS.warning,
    marginTop: 4,
    fontWeight: "500",
  },

  // Add Habito Grid
  habitosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  addHabitoCard: {
    width: "47%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  addHabitoCardDisabled: { opacity: 0.6 },
  addHabitoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  addHabitoNome: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkText,
    textAlign: "center",
  },
  jaAdicionadoBadge: { position: "absolute", top: 10, right: 10 },

  // Tip Card
  tipCard: {
    backgroundColor: COLORS.warningLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: "700", color: COLORS.warning },
  tipText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: COLORS.darkText },

  selectedHabito: { alignItems: "center", marginBottom: 24 },
  selectedIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  selectedNome: { fontSize: 18, fontWeight: "700", color: COLORS.darkText },
  selectedDesc: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: "center",
    marginTop: 4,
  },

  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.darkText,
  },
  inputHelper: { fontSize: 12, color: COLORS.lightText, marginTop: 4 },

  modalButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  cancelBtnText: {
    color: COLORS.secondaryText,
    fontWeight: "600",
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
