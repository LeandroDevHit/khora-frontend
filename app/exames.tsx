import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCheckups, createCheckup } from "@/services/checkupService";

// Funções para editar e apagar exames (implementar no service se necessário)
import { updateCheckup, deleteCheckup } from "@/services/checkupService";


export default function Exames() {
  const router = useRouter();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [editandoId, setEditandoId] = useState<number|null>(null);

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

  // Função para formatar a data enquanto digita (dd/mm/yyyy)
  function formatarDataInput(text: string) {
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0,2)}/${cleaned.slice(2,4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0,2)}/${cleaned.slice(2)}`;
    }
    return formatted;
  }

  async function handleAddExame() {
    if (!novoNome || !novaData) {
      Alert.alert("Preencha o nome e a data do exame.");
      return;
    }
    // Converter para yyyy-mm-dd antes de enviar
    const partes = novaData.split("/");
    let dataISO = "";
    if (partes.length === 3) {
      dataISO = `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
    } else {
      Alert.alert("Data inválida. Use o formato dd/mm/yyyy.");
      return;
    }
    // Impedir datas passadas (só permite hoje ou futuro)
    const dataSelecionada = new Date(dataISO);
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    dataSelecionada.setHours(0,0,0,0);
    if (dataSelecionada < hoje) {
      Alert.alert("A data não pode ser anterior à data de hoje.");
      return;
    }
    try {
      if (editandoId !== null) {
        await updateCheckup(editandoId.toString(), { nome: novoNome, data_prevista: dataISO, status: novoStatus });
      } else {
        await createCheckup({ nome: novoNome, data_prevista: dataISO, status: novoStatus });
      }
      setModalVisible(false);
      setNovoNome("");
      setNovaData("");
      setNovoStatus("");
      setEditandoId(null);
      await carregarExames();
    } catch (e) {
      Alert.alert(editandoId !== null ? "Erro ao editar exame." : "Erro ao adicionar exame.");
    }
  }

  function handleEditarExame(exame: any) {
    setNovoNome(exame.nome);
    setNovaData(exame.data_prevista ? new Date(exame.data_prevista).toLocaleDateString('pt-BR') : "");
    setNovoStatus(exame.status || "");
    setEditandoId(exame.id);
    setModalVisible(true);
  }

  async function handleApagarExame(id: number) {
    Alert.alert(
      "Apagar exame",
      "Tem certeza que deseja apagar este exame?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: async () => {
          try {
            await deleteCheckup(id.toString());
            await carregarExames();
          } catch (e) {
            Alert.alert("Erro ao apagar exame.");
          }
        }}
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* Botão de voltar para prevenção (apenas ícone, no topo) */}
      <TouchableOpacity style={styles.backIconButton} onPress={() => router.push("/tabs/prevencao") }>
        <Ionicons name="arrow-back" size={26} color="#377DFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Meus Exames</Text>

      {/* Modal de novo exame */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => {
        setModalVisible(false);
        setEditandoId(null);
      }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editandoId ? "Editar Exame" : "Novo Exame"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do exame"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Data prevista (dd/mm/yyyy)"
              value={novaData}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              maxLength={10}
              onChangeText={text => setNovaData(formatarDataInput(text))}
            />
            <TextInput
              style={styles.input}
              placeholder="Status (opcional)"
              value={novoStatus}
              onChangeText={setNovoStatus}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddExame}>
                <Text style={styles.modalButtonText}>{editandoId ? "Salvar Alterações" : "Salvar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => {
                setModalVisible(false);
                setEditandoId(null);
              }}>
                <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão para adicionar novo exame */}
      <TouchableOpacity style={styles.addButton} onPress={() => {
        setModalVisible(true);
        setEditandoId(null);
        setNovoNome("");
        setNovaData("");
        setNovoStatus("");
      }}>
        <Ionicons name="add-circle-outline" size={22} color="#377DFF" />
        <Text style={styles.addButtonText}>Adicionar novo exame</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Carregando exames...</Text>
      ) : exames.length === 0 ? (
        <Text>Nenhum exame encontrado.</Text>
      ) : (
        <FlatList
          data={exames}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon ? item.icon : "calendar-outline"} size={28} color="#377DFF" />
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.examName}>{item.nome}</Text>
                <Text style={styles.examDate}>Data: {item.data_prevista ? new Date(item.data_prevista).toLocaleDateString() : ""}</Text>
                <Text style={[styles.examStatus, statusColor(item.status)]}>{item.status || ""}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleEditarExame(item)} style={{ marginRight: 8 }}>
                  <Ionicons name="create-outline" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleApagarExame(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* Botão de voltar removido daqui, agora está no topo */}
    </View>
  );
}

function statusColor(status: string) {
  switch (status) {
    case "Realizado":
      return { color: "#4CAF50" };
    case "Pendente":
      return { color: "#FF9800" };
    case "Agendado":
      return { color: "#2196F3" };
    default:
      return { color: "#697B8C" };
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 320,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: '#377DFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: '#E6F0FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 18,
  },
  backIconButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 10,
    backgroundColor: '#F6F8FA',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  examName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  examDate: {
    fontSize: 14,
    color: "#697B8C",
    marginBottom: 2,
  },
  examStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
