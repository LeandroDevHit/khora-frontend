import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomButton from "../components/Button";
import CustomInput from "../components/CustomInput";
import { useRouter } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "../constants/GlobalStyles";
import { useUserContext } from "@/contexts/UserContext";
import { useAlert } from "@/contexts/AlertContext";
import {
  fetchHealthScore,
  fetchUserProfile,
  changePassword,
  UserProfileResponse,
} from "@/services/userService";
import { getLatestMood, saveMood } from "@/services/wellBeingService";
import { setAuthToken } from "@/services/api";

const AVATAR = require("@/assets/images/bot.jpg");

type QuickAction = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  route: string;
};

const quickActions: QuickAction[] = [
  {
    label: "Metas",
    icon: "target",
    color: Colors.primary20,
    route: "/tabs/metas",
  },
  {
    label: "Checkups",
    icon: "heart",
    color: Colors.primary10,
    route: "/exames",
  },
  {
    label: "Insights",
    icon: "sun",
    color: Colors.primary20,
    route: "/insights",
  },
];

type ProfileFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const INITIAL_FORM_STATE: ProfileFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const moodMessages: Record<string, string> = {
  feliz: "Me sinto cheio de energia e otimista hoje.",
  bom: "Me sinto bem e produtivo hoje.",
  ok: "Me sinto equilibrado e produtivo hoje.",
  neutro: "Estou mantendo o foco e aberto a novas experiências.",
  ansioso: "Estou sentindo mais tensão e vou praticar respiração guiada.",
  triste: "Estou acolhendo minhas emoções e buscando apoio.",
  ruim: "Hoje está sendo difícil, mas vou buscar apoio.",
};

type MoodOption = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

const moodOptions: MoodOption[] = [
  { key: "feliz", label: "Feliz", icon: "smile", color: "#4CAF50" },
  { key: "bom", label: "Bom", icon: "thumbs-up", color: "#8BC34A" },
  { key: "ok", label: "OK", icon: "meh", color: "#FFC107" },
  { key: "neutro", label: "Neutro", icon: "minus", color: "#9E9E9E" },
  { key: "ansioso", label: "Ansioso", icon: "alert-circle", color: "#FF9800" },
  { key: "triste", label: "Triste", icon: "frown", color: "#2196F3" },
  { key: "ruim", label: "Ruim", icon: "thumbs-down", color: "#F44336" },
];

type LoadMode = "initial" | "refresh" | "silent";

const defaultMoodMessage =
  "Compartilhe como você está se sentindo para personalizarmos sua jornada.";

const capitalize = (value?: string | null) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const calculateAge = (dateString?: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const extractDateOnly = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  const numeric = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(numeric)) return null;
  return numeric;
};

const decimalToInputString = (value: string | number | null | undefined) => {
  const numeric = toNumber(value);
  if (numeric === null) return "";
  return numeric.toString().replace(".", ",");
};

const parseDecimalInput = (value: string): number | null => {
  if (!value) return null;
  const normalized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
  if (!normalized) return null;
  const numeric = parseFloat(normalized);
  if (Number.isNaN(numeric)) return null;
  return numeric;
};

const normalizeHealthScoreResponse = (
  response: any
): { score: number | null; mood: string | null } => {
  if (typeof response === "number") {
    return { score: response, mood: null };
  }
  if (response && typeof response === "object") {
    const score = typeof response.score === "number" ? response.score : null;
    const mood =
      typeof response.details?.mood === "string" ? response.details.mood : null;
    return { score, mood };
  }
  return { score: null, mood: null };
};

const mapProfileToForm = (
  profile?: UserProfileResponse | null
): ProfileFormState => ({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

export default function Perfil() {
  const router = useRouter();
  const { userName, userEmail, setUserName, setUserEmail } = useUserContext();
  const { showError, showSuccess } = useAlert();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [formState, setFormState] =
    useState<ProfileFormState>(INITIAL_FORM_STATE);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [latestMood, setLatestMood] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
  const [savingMood, setSavingMood] = useState(false);
  const isEditingRef = useRef(false);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  const loadProfileData = useCallback(
    async (mode: LoadMode = "initial") => {
      if (mode === "initial") setIsLoadingProfile(true);
      if (mode === "refresh") setRefreshing(true);

      try {
        const profileResponse = await fetchUserProfile();
        setProfile(profileResponse);
        if (profileResponse?.user?.name) {
          setUserName(profileResponse.user.name);
        }
        if (profileResponse?.user?.email) {
          setUserEmail(profileResponse.user.email);
        }
        if (!isEditingRef.current) {
          setFormState(mapProfileToForm(profileResponse));
        }
      } catch (error) {
        if (mode !== "silent") {
          showError(
            "Erro ao carregar perfil",
            "Não foi possível buscar suas informações. Verifique sua conexão e tente novamente."
          );
        }
      }

      try {
        const healthResponse = await fetchHealthScore();
        const normalized = normalizeHealthScoreResponse(healthResponse);
        setHealthScore(normalized.score);
        setLatestMood(normalized.mood ?? null);
      } catch (error) {
        console.warn("Erro ao carregar health score", error);
      }

      // Buscar último mood registrado como fallback
      try {
        const latestMoodEntry = await getLatestMood();
        if (latestMoodEntry?.mood) {
          setLatestMood(latestMoodEntry.mood);
        }
      } catch (error) {
        console.warn("Erro ao buscar último mood", error);
      } finally {
        if (mode === "initial") setIsLoadingProfile(false);
        if (mode === "refresh") setRefreshing(false);
      }
    },
    [showError, setUserEmail, setUserName]
  );

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    if (profile?.user?.name && profile.user.name !== userName) {
      setUserName(profile.user.name);
    }

    if (profile?.user?.email && profile.user.email !== userEmail) {
      setUserEmail(profile.user.email);
    }
  }, [
    profile?.user?.name,
    profile?.user?.email,
    setUserEmail,
    setUserName,
    userEmail,
    userName,
  ]);

  const onRefresh = useCallback(
    () => loadProfileData("refresh"),
    [loadProfileData]
  );

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formState.currentPassword) {
      showError("Campo obrigatório", "Informe sua senha atual.");
      return false;
    }

    if (!formState.newPassword) {
      showError("Campo obrigatório", "Informe a nova senha.");
      return false;
    }

    if (formState.newPassword.length < 6) {
      showError(
        "Senha fraca",
        "A nova senha deve ter pelo menos 6 caracteres."
      );
      return false;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      showError("Senhas diferentes", "A confirmação de senha não confere.");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;
    setSavingProfile(true);
    try {
      await changePassword({
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
      });

      showSuccess("Senha alterada", "Sua senha foi alterada com sucesso.");
      setIsEditing(false);
      setFormState(INITIAL_FORM_STATE);
    } catch (error) {
      showError(
        "Erro ao alterar senha",
        "Não foi possível alterar sua senha. Verifique a senha atual e tente novamente."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          // Remove o token de autenticação
          setAuthToken(null);
          // Limpa os dados do contexto
          setUserName("");
          setUserEmail("");
          // Redireciona para a tela de login
          router.replace("/auth/login" as any);
        },
      },
    ]);
  };

  const openEditModal = () => {
    setFormState(mapProfileToForm(profile));
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setFormState(mapProfileToForm(profile));
    setIsEditing(false);
  };

  const openMoodModal = () => {
    setIsMoodModalVisible(true);
  };

  const closeMoodModal = () => {
    setIsMoodModalVisible(false);
  };

  const handleSaveMood = async (selectedMood: string) => {
    setSavingMood(true);
    try {
      await saveMood(selectedMood, "profile");
      setLatestMood(selectedMood);
      showSuccess(
        "Humor registrado!",
        `Você está se sentindo: ${capitalize(selectedMood)}`
      );
      closeMoodModal();
      // Recarrega os dados para atualizar o health score
      await loadProfileData("silent");
    } catch (error) {
      showError(
        "Erro ao registrar humor",
        "Não foi possível salvar seu humor. Tente novamente."
      );
    } finally {
      setSavingMood(false);
    }
  };

  const profileStats = useMemo(
    () => [
      {
        label: "Idade",
        value: (() => {
          const age = calculateAge(profile?.data_nascimento);
          return age ? `${age} anos` : "—";
        })(),
        icon: "clock",
      },
      {
        label: "Peso",
        value: (() => {
          const numeric = toNumber(profile?.peso_kg);
          return numeric !== null ? `${numeric.toFixed(1)} kg` : "—";
        })(),
        icon: "activity",
      },
      {
        label: "Altura",
        value: profile?.altura_cm ? `${profile.altura_cm} cm` : "—",
        icon: "trending-up",
      },
    ],
    [profile]
  );

  const handleQuickActionPress = useCallback(
    (action: QuickAction) => {
      if (!action?.route) return;
      router.push(action.route as any);
    },
    [router]
  );
  const moodKey = latestMood?.toLowerCase() ?? "";
  const moodDescription = moodMessages[moodKey] ?? defaultMoodMessage;
  const backendName = profile?.user?.name ?? null;
  const displayName = backendName ?? userName ?? "Usuário Khora";
  const primaryEmail = profile?.user?.email ?? userEmail ?? "Não informado";
  const normalizedScore =
    healthScore !== null ? Math.max(0, Math.min(healthScore, 100)) : 0;
  const progressValueLabel = healthScore !== null ? `${normalizedScore}%` : "—";
  const birthDateLabel =
    formatDateForDisplay(profile?.data_nascimento) ?? "Não informada";
  const genderLabel = profile?.genero
    ? capitalize(profile.genero)
    : "Não informado";
  const isInitialLoading = isLoadingProfile && !profile;

  if (isInitialLoading) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando seu perfil...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.avatarRing}>
            <Image source={AVATAR} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>Journey • Usuário Khora</Text>

          <View style={styles.badgesRow}>
            <View style={[styles.badge, styles.secondaryBadge]}>
              <Feather name="zap" size={16} color={Colors.primary} />
              <Text style={[styles.badgeText, styles.badgeSecondaryText]}>
                {healthScore !== null
                  ? `Score ${normalizedScore}`
                  : "Streak em andamento"}
              </Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Bem-estar semanal</Text>
              <Text style={styles.progressValue}>{progressValueLabel}</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${healthScore !== null ? normalizedScore : 12}%` },
                ]}
              />
            </View>
            <Text style={styles.progressHint}>
              {latestMood
                ? `Último humor: ${capitalize(latestMood)}`
                : "Registre seu humor para ver insights"}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações da conta</Text>
          <View style={styles.infoLine}>
            <Feather name="mail" size={18} color={Colors.primary} />
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{primaryEmail}</Text>
            </View>
          </View>
        </View>

        <View style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitleText}>Sentimento atual</Text>
            <Feather name="smile" size={20} color={Colors.textWhite} />
          </View>
          <Text style={styles.moodText}>{moodDescription}</Text>
          <View style={styles.moodActions}>
            <TouchableOpacity style={styles.moodTag} onPress={openMoodModal}>
              <Feather name="edit-3" size={14} color={Colors.textWhite} />
              <Text style={styles.moodTagText}>Registrar novo mood</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moodTag}
              onPress={() => router.push("/chat" as any)}
            >
              <Feather
                name="message-circle"
                size={14}
                color={Colors.textWhite}
              />
              <Text style={styles.moodTagText}>Falar com coach</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Acessos rápidos</Text>
          <View style={styles.quickActionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickAction, { backgroundColor: action.color }]}
                onPress={() => handleQuickActionPress(action)}
              >
                <Feather
                  name={action.icon as any}
                  size={18}
                  color={Colors.primaryDark}
                />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionsColumn}>
          <CustomButton
            title={isLoadingProfile ? "Carregando..." : "Alterar senha"}
            onPress={openEditModal}
            width="100%"
            disabled={isLoadingProfile}
          />
          <CustomButton
            title="Sair da conta"
            variant="secondary"
            onPress={handleLogout}
            width="100%"
          />
        </View>
      </ScrollView>

      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alterar senha</Text>
              <Text style={styles.sectionDescription}>
                Preencha os campos abaixo para alterar sua senha.
              </Text>
              <ScrollView
                contentContainerStyle={styles.modalForm}
                showsVerticalScrollIndicator={false}
              >
                <CustomInput
                  placeholder="Senha atual"
                  value={formState.currentPassword}
                  onChangeText={(value) =>
                    handleInputChange("currentPassword", value)
                  }
                  width="100%"
                  iconName="lock"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.helperText}>Digite sua senha atual</Text>

                <CustomInput
                  placeholder="Nova senha"
                  value={formState.newPassword}
                  onChangeText={(value) =>
                    handleInputChange("newPassword", value)
                  }
                  width="100%"
                  iconName="lock"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.helperText}>Mínimo 6 caracteres</Text>

                <CustomInput
                  placeholder="Confirmar nova senha"
                  value={formState.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  width="100%"
                  iconName="lock"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.helperText}>Repita a nova senha</Text>
              </ScrollView>
              <View style={styles.modalActions}>
                <CustomButton
                  title="Cancelar"
                  variant="secondary"
                  onPress={closeEditModal}
                  width="48%"
                  disabled={savingProfile}
                />
                <CustomButton
                  title={savingProfile ? "Salvando..." : "Alterar"}
                  onPress={handleChangePassword}
                  width="48%"
                  disabled={savingProfile}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal de seleção de Mood */}
      <Modal
        visible={isMoodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeMoodModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.moodModalContent}>
            <Text style={styles.modalTitle}>Como você está se sentindo?</Text>
            <Text style={styles.sectionDescription}>
              Selecione o emoji que melhor representa seu humor agora
            </Text>

            <View style={styles.moodOptionsGrid}>
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.moodOptionItem,
                    latestMood === option.key && styles.moodOptionSelected,
                    { borderColor: option.color },
                  ]}
                  onPress={() => handleSaveMood(option.key)}
                  disabled={savingMood}
                >
                  <Feather name={option.icon} size={28} color={option.color} />
                  <Text
                    style={[styles.moodOptionLabel, { color: option.color }]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {savingMood && (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginTop: Spacing.md }}
              />
            )}

            <CustomButton
              title="Cancelar"
              variant="secondary"
              onPress={closeMoodModal}
              width="100%"
              disabled={savingMood}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  hero: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 250,
    backgroundColor: Colors.primary50,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: Colors.white,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    textAlign: "center",
  },
  role: {
    color: Colors.primary20,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
  },
  primaryBadge: {
    backgroundColor: Colors.primaryDark,
  },
  secondaryBadge: {
    backgroundColor: Colors.white,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textWhite,
  },
  badgeSecondaryText: {
    color: Colors.primary,
  },
  progressCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.round,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "82%",
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginTop: 4,
    color: Colors.textPrimary,
  },
  infoCard: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  infoLine: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  infoTextBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  moodCard: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDark,
    gap: Spacing.md,
  },
  moodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodText: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    lineHeight: 22,
  },
  moodActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  moodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
  },
  moodTagText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  quickActionsCard: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  quickActionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.primaryDark,
    fontWeight: FontWeights.medium,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutBtnText: {
    color: Colors.error,
    fontWeight: FontWeights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalForm: {
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  helperText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  moodModalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  moodOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  moodOptionItem: {
    width: 85,
    height: 85,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    gap: Spacing.xs,
  },
  moodOptionSelected: {
    backgroundColor: Colors.primary10,
    borderWidth: 3,
  },
  moodOptionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  moodTitleText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  actionsColumn: {
    flexDirection: "column",
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
