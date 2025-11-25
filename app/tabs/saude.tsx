import { fetchSaudeMental } from "@/services/wellBeingService";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

export default function Saude() {
  const router = useRouter();
  const [emocoes, setEmocoes] = useState<Emocao[]>([
    {
      id: "1",
      nome: "Feliz",
      emoji: "😄",
      descricao: "Alegre e satisfeito",
    },
    {
      id: "2",
      nome: "Triste",
      emoji: "😭",
      descricao: "Sentindo-se melancólico",
    },
    {
      id: "3",
      nome: "Ansioso",
      emoji: "😰",
      descricao: "Preocupado ou nervoso",
    },
    {
      id: "4",
      nome: "Calmo",
      emoji: "🙂",
      descricao: "Relaxado e tranquilo",
    },
    {
      id: "5",
      nome: "Irritado",
      emoji: "😤",
      descricao: "Frustrado ou irritável",
    },
    {
      id: "6",
      nome: "Neutro",
      emoji: "😐",
      descricao: "Indiferente ou neutro",
    },
  ]);

  const [recursos, setRecursos] = useState<Recurso[]>([
    {
      id: "1",
      titulo: "Respiração Guiada",
      descricao: "Técnicas de respiração para relaxar",
      icone: "fitness",
      acao: "Iniciar",
    },
    {
      id: "2",
      titulo: "Meditações Curtas",
      descricao: "Sessões rápidas de meditação",
      icone: "leaf",
      acao: "Explorar",
    },
    {
      id: "3",
      titulo: "Apoio Profissional",
      descricao: "Fale com um profissional",
      icone: "help-circle",
      acao: "Contatar",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [emocaoSelecionada, setEmocaoSelecionada] = useState<Emocao | null>(null);
  const [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchSaudeMental();
        setAudios(Array.isArray(data) ? data : []);
      } catch (err) {
        setAudios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleEmocaoSelect = (emocao: Emocao) => {
    setEmocaoSelecionada(emocao);
    setModalVisible(true);
  };

  const handleRecursoPress = (recurso: Recurso) => {
    Alert.alert(
      recurso.titulo,
      `${recurso.descricao}\n\nEsta funcionalidade será implementada em breve.`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com voltar */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.mainTitle}>Termômetro de Emoções</Text>
            <Text style={styles.subtitle}>Como você está se sentindo hoje?</Text>
          </View>
        </View>

        {/* Grid de Emoções */}
        <View style={styles.emocionsContainer}>
          <View style={styles.emocionsRow}>
            {emocoes.slice(0, 3).map((emocao) => (
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
            {emocoes.slice(3, 6).map((emocao) => (
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
              <Text style={styles.analiseTitulo}>Análise Facial de Emoções</Text>
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

        {/* Insights com Timeline Vertical */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLabel}>
            <Text style={styles.timelineLabelText}>Insights</Text>
          </View>

          <View style={styles.verticalTimeline}>
            {/* Linha vertical */}
            <View style={styles.timelineLine} />

            {/* Item 1 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarker} />
              <TouchableOpacity style={styles.timelineCard}>
                <View style={styles.timelineCardHeader}>
                  <Ionicons name="trending-up" size={20} color="#3B82F6" />
                  <Text style={styles.timelineCardTitle}>Seu Padrão</Text>
                </View>
                <Text style={styles.timelineCardDesc}>
                  Você foi mais feliz nos últimos 7 dias
                </Text>
              </TouchableOpacity>
            </View>

            {/* Item 2 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarker} />
              <TouchableOpacity style={styles.timelineCard}>
                <View style={styles.timelineCardHeader}>
                  <Ionicons name="star" size={20} color="#F59E0B" />
                  <Text style={styles.timelineCardTitle}>Melhor Dia</Text>
                </View>
                <Text style={styles.timelineCardDesc}>
                  Seu melhor dia foi ontem
                </Text>
              </TouchableOpacity>
            </View>

            {/* Item 3 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarker} />
              <TouchableOpacity style={styles.timelineCard}>
                <View style={styles.timelineCardHeader}>
                  <Ionicons name="alert-circle" size={20} color="#10B981" />
                  <Text style={styles.timelineCardTitle}>Dica</Text>
                </View>
                <Text style={styles.timelineCardDesc}>
                  Medite 5 min para melhorar seu bem-estar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recursos de Apoio */}
        <View style={styles.recursosSection}>
          <Text style={styles.recursosTitle}>Recursos de Apoio</Text>

          {recursos.map((recurso) => (
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

        {/* Áudios e Meditações */}
        {audios.length > 0 && (
          <View style={styles.audiosSection}>
            <Text style={styles.audioTitle}>Áudios e Meditações</Text>
            {audios.map((audio, idx) => (
              <View key={idx} style={styles.audioCard}>
                <Ionicons name="volume-high" size={20} color="#3B82F6" />
                <View style={styles.audioContent}>
                  <Text style={styles.audioCardTitle}>
                    {audio.nome || audio.name || "Áudio"}
                  </Text>
                  <Text style={styles.audioCardDesc}>
                    {audio.descricao || audio.description || ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

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
              <Text style={styles.selectedEmoji}>{emocaoSelecionada?.emoji}</Text>
              <Text style={styles.selectedEmocao}>{emocaoSelecionada?.nome}</Text>
              <Text style={styles.selectedDesc}>
                {emocaoSelecionada?.descricao}
              </Text>

              <View style={styles.sugestoesContainer}>
                <Text style={styles.sugestoesTitle}>
                  Sugestões para você:
                </Text>

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
                    <Text style={styles.sugestaoBtnDesc}>
                      Abra seu coração
                    </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  timelineContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  timelineLabel: {
    marginBottom: 16,
  },
  timelineLabelText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  verticalTimeline: {
    position: "relative",
    paddingLeft: 32,
  },
  timelineLine: {
    position: "absolute",
    left: 6,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#D1D5DB",
  },
  timelineItem: {
    marginBottom: 24,
    position: "relative",
  },
  timelineMarker: {
    position: "absolute",
    left: -32,
    top: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3B82F6",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  timelineCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timelineCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
  timelineCardDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});