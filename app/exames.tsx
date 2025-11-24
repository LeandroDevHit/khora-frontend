import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCheckups } from "@/services/checkupService";


export default function Exames() {
  const router = useRouter();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res: any = await fetchCheckups();
        setExames(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        setExames([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Exames</Text>

      {/* Botão para adicionar novo exame */}
      <TouchableOpacity style={styles.addButton} onPress={() => {/* lógica para adicionar exame */}}>
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
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* Botão para voltar para prevenção */}
  <TouchableOpacity style={styles.backButton} onPress={() => router.push("/tabs/prevencao") }>
        <Ionicons name="arrow-back" size={20} color="#377DFF" />
        <Text style={styles.backButtonText}>Voltar para Prevenção</Text>
      </TouchableOpacity>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#F6F8FA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
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
