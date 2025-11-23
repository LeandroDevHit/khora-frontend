import { fetchSaudeMental } from "@/services/api";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Saude() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Áudios e Meditações</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : audios.length === 0 ? (
        <Text>Nenhum áudio encontrado.</Text>
      ) : (
        <ScrollView style={styles.scroll}>
          {audios.map((audio, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>{audio.nome || audio.name || "Áudio"}</Text>
              <Text style={styles.cardDesc}>{audio.descricao || audio.description || ""}</Text>
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
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  cardDesc: { fontSize: 15, color: "#697B8C" },
});
