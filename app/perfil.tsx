import { fetchUserProfile } from "@/services/api";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Perfil() {
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.text}>Carregando...</Text>
      ) : profile ? (
        <>
          <Text style={styles.text}>Perfil do Usuário</Text>
          <Text style={styles.info}>Nome: {profile.name || "-"}</Text>
          <Text style={styles.info}>Email: {profile.email || "-"}</Text>
        </>
      ) : (
        <Text style={styles.text}>Não foi possível carregar o perfil.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 8 },
});
