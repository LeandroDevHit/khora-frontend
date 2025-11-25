import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

import {
  fetchDashboard,
  updatePeso,
  DashboardResponse,
  HabitoProgresso,
} from "@/services/metaService";

const { width } = Dimensions.get("window");

// --- CORES ---
const COLORS = {
  primary: "#3b82f6",
  primaryLight: "#dbeafe",
  success: "#22c55e",
  successLight: "#dcfce7",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  error: "#ef4444",
  errorLight: "#fee2e2",
  darkText: "#1e293b",
  secondaryText: "#64748b",
  lightText: "#94a3b8",
  background: "#f8fafc",
  cardBg: "#ffffff",
  divider: "#e2e8f0",
};

export default function MetasScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dados do backend
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [pesoAtual, setPesoAtual] = useState<number>(0);
  const [metaPeso, setMetaPeso] = useState<number>(70);
  const [habitos, setHabitos] = useState<HabitoProgresso[]>([]);

  // Histórico de peso (simulado por enquanto)
  const [historicoData, setHistoricoData] = useState<
    { value: number; label?: string }[]
  >([]);

  // Modal de edição
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<"peso" | "meta">("peso");
  const [inputValue, setInputValue] = useState("");

  const loadData = useCallback(async () => {
    try {
      // Carregar dados do dashboard
      const data = await fetchDashboard();
      setDashboardData(data);

      if (data?.indicadoresSaude?.peso) {
        setPesoAtual(data.indicadoresSaude.peso);
      }

      // Carregar hábitos
      if (data?.habitos?.habitosAtivos) {
        setHabitos(data.habitos.habitosAtivos);
      }

      // Carregar meta de peso salva localmente
      const savedMeta = await AsyncStorage.getItem("@khora_meta_peso");
      if (savedMeta) {
        setMetaPeso(parseFloat(savedMeta));
      }

      // Gerar histórico de peso simulado (últimos 6 meses)
      const pesoBase = data?.indicadoresSaude?.peso || 75;
      const historico = Array.from({ length: 6 }, (_, i) => ({
        value: Math.round((pesoBase + (Math.random() * 6 - 3)) * 10) / 10,
        label: i === 0 ? "Jan" : i === 2 ? "Mar" : i === 5 ? "Jun" : undefined,
      }));
      setHistoricoData(historico);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

  const openEditModal = (type: "peso" | "meta") => {
    setEditType(type);
    setInputValue(type === "peso" ? pesoAtual.toString() : metaPeso.toString());
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido.");
      return;
    }

    setSaving(true);
    try {
      if (editType === "peso") {
        const success = await updatePeso(value);
        if (success) {
          setPesoAtual(value);
          Alert.alert("Sucesso", "Peso atualizado!");
        } else {
          Alert.alert("Erro", "Não foi possível atualizar o peso.");
        }
      } else {
        setMetaPeso(value);
        await AsyncStorage.setItem("@khora_meta_peso", value.toString());
        Alert.alert("Sucesso", "Meta de peso atualizada!");
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMeta = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem("@khora_meta_peso", metaPeso.toString());
      Alert.alert("Sucesso", "Meta salva com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar sua meta.");
    } finally {
      setSaving(false);
    }
  };

  // Cálculos de progresso
  const progressPercent =
    pesoAtual > 0 && metaPeso > 0
      ? Math.max(
          0,
          Math.min(100, ((pesoAtual - metaPeso) / (pesoAtual * 0.2)) * 100)
        )
      : 0;

  const faltaParaMeta = Math.max(0, pesoAtual - metaPeso);
  const tendencia =
    historicoData.length >= 2
      ? (((historicoData[historicoData.length - 1]?.value || 0) -
          (historicoData[0]?.value || 0)) /
          (historicoData[0]?.value || 1)) *
        100
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando suas metas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Suas Metas</Text>
          <Text style={styles.subtitle}>
            Acompanhe seu progresso e conquiste seus objetivos.
          </Text>
        </View>

        {/* Card de Progresso de Peso */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Peso atual</Text>
              <TouchableOpacity onPress={() => openEditModal("peso")}>
                <View style={styles.pesoRow}>
                  <Text style={styles.pesoValue}>
                    {pesoAtual > 0 ? `${pesoAtual}` : "--"}
                  </Text>
                  <Text style={styles.pesoUnit}>kg</Text>
                  <Feather
                    name="edit-2"
                    size={16}
                    color={COLORS.lightText}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.periodoText}>Últimos 3 meses</Text>
            </View>

            <View style={styles.trendBadge}>
              <Text
                style={[
                  styles.trendText,
                  { color: tendencia < 0 ? COLORS.success : COLORS.error },
                ]}
              >
                {tendencia < 0 ? "" : "+"}
                {tendencia.toFixed(1)}%
              </Text>
              <Ionicons
                name={tendencia < 0 ? "trending-down" : "trending-up"}
                size={18}
                color={tendencia < 0 ? COLORS.success : COLORS.error}
              />
            </View>
          </View>

          {/* Gráfico */}
          {historicoData.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={historicoData}
                color={COLORS.primary}
                thickness={3}
                hideRules
                hideYAxisText
                startFillColor={COLORS.primary}
                endFillColor={`${COLORS.primary}00`}
                startOpacity={0.15}
                endOpacity={0}
                curved
                height={120}
                width={width - 80}
                spacing={50}
                initialSpacing={10}
                dataPointsColor={COLORS.primary}
                dataPointsRadius={4}
              />
            </View>
          )}

          {/* Meta de peso */}
          <View style={styles.metaRowContainer}>
            <Text style={styles.metaRowLabel}>Meta de peso</Text>
            <TouchableOpacity
              onPress={() => openEditModal("meta")}
              style={styles.metaValueWrap}
            >
              <Text style={styles.metaRowValue}>{metaPeso}kg</Text>
              <Feather name="edit-2" size={14} color={COLORS.lightText} />
            </TouchableOpacity>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${100 - progressPercent}%` },
              ]}
            />
          </View>

          <Text style={styles.progressHelper}>
            {faltaParaMeta > 0
              ? `Faltam ${faltaParaMeta.toFixed(1)}kg para sua meta`
              : "🎉 Parabéns! Você atingiu sua meta!"}
          </Text>
        </View>

        {/* IMC Card */}
        {dashboardData?.indicadoresSaude?.imc && (
          <View style={styles.imcCard}>
            <View style={styles.imcHeader}>
              <Ionicons name="analytics" size={24} color={COLORS.primary} />
              <Text style={styles.imcTitle}>Seu IMC</Text>
            </View>
            <View style={styles.imcContent}>
              <Text style={styles.imcValue}>
                {dashboardData.indicadoresSaude.imc.toFixed(1)}
              </Text>
              <View
                style={[
                  styles.imcBadge,
                  {
                    backgroundColor:
                      dashboardData.indicadoresSaude.categoriaIMC ===
                      "Peso normal"
                        ? COLORS.successLight
                        : COLORS.warningLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.imcCategoria,
                    {
                      color:
                        dashboardData.indicadoresSaude.categoriaIMC ===
                        "Peso normal"
                          ? COLORS.success
                          : COLORS.warning,
                    },
                  ]}
                >
                  {dashboardData.indicadoresSaude.categoriaIMC}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Card para Gerenciar Hábitos */}
        <TouchableOpacity
          style={styles.habitosCardLink}
          onPress={() => router.push("/habitos")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.habitosIconWrap,
              { backgroundColor: COLORS.primaryLight },
            ]}
          >
            <Ionicons name="fitness" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.habitosLinkInfo}>
            <Text style={styles.habitosLinkTitle}>Superando Vícios</Text>
            <Text style={styles.habitosLinkDesc}>
              {habitos.length > 0
                ? `${habitos.length} hábito(s) em acompanhamento`
                : "Adicione hábitos que deseja superar"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Hábitos em Progresso */}
        {habitos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Seus Hábitos</Text>
            {habitos.map((habito, index) => (
              <TouchableOpacity
                key={habito.id || index}
                style={styles.habitoCard}
                onPress={() => {
                  if (habito.id) {
                    router.push({
                      pathname: "/insights",
                      params: { id: habito.id },
                    });
                  } else {
                    Alert.alert(
                      "Erro",
                      "Não foi possível abrir os detalhes deste hábito"
                    );
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.habitoHeader}>
                  <View
                    style={[
                      styles.habitoIconWrap,
                      { backgroundColor: COLORS.successLight },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                  </View>
                  <View style={styles.habitoInfo}>
                    <Text style={styles.habitoNome}>{habito.nome}</Text>
                    {habito.metaPessoal && (
                      <Text style={styles.habitoMeta}>
                        {habito.metaPessoal}
                      </Text>
                    )}
                  </View>
                  <View style={styles.diasBadge}>
                    <Text style={styles.diasNum}>{habito.diasLivres}</Text>
                    <Text style={styles.diasLabel}>dias</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.lightText}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Estatísticas */}
        {dashboardData?.habitos?.estatisticas && (
          <>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color={COLORS.warning} />
                <Text style={styles.statValue}>
                  {dashboardData.conquistas?.total || 0}
                </Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color={COLORS.error} />
                <Text style={styles.statValue}>
                  {dashboardData.habitos.estatisticas.semRecaida}
                </Text>
                <Text style={styles.statLabel}>Sem recaída</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="cash" size={24} color={COLORS.success} />
                <Text style={styles.statValue}>
                  R$
                  {dashboardData.habitos.estatisticas.economiaTotal.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Economizado</Text>
              </View>
            </View>
          </>
        )}

        {/* Botão Salvar Meta */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveMeta}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="check" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Salvar meta de peso</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Atalhos */}
        <Text style={styles.sectionTitle}>Atalhos</Text>
        <View style={styles.atalhosRow}>
          <TouchableOpacity
            style={styles.atalhoItem}
            onPress={() => router.push("/exames")}
          >
            <View
              style={[
                styles.atalhoIconWrap,
                { backgroundColor: COLORS.errorLight },
              ]}
            >
              <Ionicons name="heart" size={22} color={COLORS.error} />
            </View>
            <Text style={styles.atalhoTxt}>Checkups</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.atalhoItem}
            onPress={() => router.push("/analiseEmocional")}
          >
            <View
              style={[
                styles.atalhoIconWrap,
                { backgroundColor: COLORS.primaryLight },
              ]}
            >
              <Ionicons name="bar-chart" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.atalhoTxt}>Análise</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editType === "peso"
                ? "Atualizar peso atual"
                : "Definir meta de peso"}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="decimal-pad"
                placeholder="Ex: 75.5"
                placeholderTextColor={COLORS.lightText}
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalBtnSaveText}>Salvar</Text>
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
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 80 },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: COLORS.secondaryText },

  // Header
  header: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    color: COLORS.darkText,
  },
  subtitle: { color: COLORS.secondaryText, fontSize: 15, lineHeight: 22 },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 14,
    color: COLORS.darkText,
  },

  // Progress Card
  progressCard: {
    backgroundColor: COLORS.cardBg,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  progressLabel: { fontSize: 14, color: COLORS.secondaryText, marginBottom: 4 },
  pesoRow: { flexDirection: "row", alignItems: "baseline" },
  pesoValue: { fontSize: 32, fontWeight: "800", color: COLORS.darkText },
  pesoUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginLeft: 4,
  },
  periodoText: { fontSize: 12, color: COLORS.lightText, marginTop: 4 },

  // Trend Badge
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: { fontSize: 14, fontWeight: "700" },

  // Chart
  chartContainer: { marginVertical: 16, alignItems: "center" },

  // Meta Row
  metaRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  metaRowLabel: { fontSize: 14, color: COLORS.secondaryText },
  metaValueWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaRowValue: { fontSize: 16, fontWeight: "700", color: COLORS.darkText },

  // Progress Bar
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.divider,
    borderRadius: 5,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressHelper: { fontSize: 13, color: COLORS.secondaryText, marginTop: 10 },

  // IMC Card
  imcCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imcHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  imcTitle: { fontSize: 16, fontWeight: "600", color: COLORS.darkText },
  imcContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imcValue: { fontSize: 28, fontWeight: "800", color: COLORS.darkText },
  imcBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  imcCategoria: { fontSize: 13, fontWeight: "600" },

  // Card Link para Hábitos
  habitosCardLink: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  habitosIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  habitosLinkInfo: { flex: 1, marginLeft: 12 },
  habitosLinkTitle: { fontSize: 16, fontWeight: "700", color: COLORS.darkText },
  habitosLinkDesc: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },

  // Hábitos
  habitoCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  habitoHeader: { flexDirection: "row", alignItems: "center" },
  habitoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  habitoInfo: { flex: 1, marginLeft: 12 },
  habitoNome: { fontSize: 16, fontWeight: "600", color: COLORS.darkText },
  habitoMeta: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },
  diasBadge: {
    alignItems: "center",
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  diasNum: { fontSize: 20, fontWeight: "800", color: COLORS.success },
  diasLabel: { fontSize: 11, color: COLORS.success, fontWeight: "500" },

  // Stats Grid
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.darkText,
    marginTop: 8,
  },
  statLabel: { fontSize: 12, color: COLORS.secondaryText, marginTop: 4 },

  // Save Button
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
    gap: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Atalhos
  atalhosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  atalhoItem: { alignItems: "center", flex: 1 },
  atalhoIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  atalhoTxt: { color: COLORS.darkText, fontSize: 12, fontWeight: "500" },

  // Modal
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.darkText,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.darkText,
    paddingVertical: 14,
  },
  inputUnit: { fontSize: 16, fontWeight: "600", color: COLORS.secondaryText },
  modalButtons: { flexDirection: "row", gap: 12 },
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
  modalBtnSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  modalBtnSaveText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
