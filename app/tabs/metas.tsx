import { fetchUserMetas } from "@/services/api";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Metas() {
  const [metas, setMetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserMetas();
        setMetas(Array.isArray(data) ? data : []);
      } catch (err) {
        setMetas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Metas</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : metas.length === 0 ? (
        <Text>Nenhuma meta encontrada.</Text>
      ) : (
        <ScrollView style={styles.scroll}>
          {metas.map((meta, idx) => (
            <View key={idx} style={styles.metaCard}>
              <Text style={styles.metaTitle}>{meta.titulo || meta.title || "Meta"}</Text>
              <Text style={styles.metaDesc}>{meta.descricao || meta.description || ""}</Text>
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
  metaCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  metaTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  metaDesc: { fontSize: 15, color: "#697B8C" },
});
