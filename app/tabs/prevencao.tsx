import { fetchPrevencao } from "@/services/api";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Prevencao() {
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchPrevencao();
        setExercicios(Array.isArray(data) ? data : []);
      } catch (err) {
        setExercicios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercícios de Prevenção</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : exercicios.length === 0 ? (
        <Text>Nenhum exercício encontrado.</Text>
      ) : (
        <ScrollView style={styles.scroll}>
          {exercicios.map((ex, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>{ex.nome || ex.name || "Exercício"}</Text>
              <Text style={styles.cardDesc}>{ex.descricao || ex.description || ""}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: "#E6F0FF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  cardDesc: { fontSize: 15, color: "#697B8C" },
});
