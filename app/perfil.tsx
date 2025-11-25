import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

const AVATAR = require("@/assets/images/bot.jpg");

export default function Perfil() {
  // static example data — replace with real data from context/API when available
  const fullName = "Caio Nunes";
  const email = "caio.nunes@example.com";
  const phone = "+55 11 91234-5678";
  const age = 29;
  const weight = 75;
  const height = 178; // cm
  const feeling = "Me sinto bem";

  function confirmDelete() {
    Alert.alert("Deletar perfil", "Deseja realmente deletar seu perfil? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Deletar", style: "destructive", onPress: () => console.log("Perfil deletado (simulado)") },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header} />

      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Image source={AVATAR} style={styles.avatar} />
          <View style={styles.puddle} />
        </View>

        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.role}>Usuário Khora</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Idade</Text>
            <Text style={styles.detailValue}>{age} anos</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Peso</Text>
            <Text style={styles.detailValue}>{weight} kg</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Altura</Text>
            <Text style={styles.detailValue}>{height} cm</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Sentimento</Text>
          <Text style={styles.infoValue}>{feeling}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
            <Text style={styles.deleteBtnText}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FF" },
  header: { height: 90, backgroundColor: "#fff" },
  card: {
    marginTop: -40,
    marginHorizontal: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarWrap: { width: 120, height: 80, alignItems: 'center', justifyContent: 'flex-start' },
  avatar: { width: 96, height: 96, borderRadius: 48, marginTop: -48, borderWidth: 4, borderColor: "#fff" },
  puddle: { position: 'absolute', bottom: 6, width: 110, height: 18, borderRadius: 18, backgroundColor: 'rgba(58,128,249,0.10)' },
  name: { fontSize: 20, fontWeight: "700", marginTop: 8, color: "#0f172a" },
  role: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 },
  detailBox: { flex: 1, alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#94a3b8' },
  detailValue: { fontSize: 16, color: '#111827', fontWeight: '700', marginTop: 4 },
  infoBox: { width: "100%", marginTop: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  infoLabel: { fontSize: 12, color: "#94a3b8" },
  infoValue: { fontSize: 16, color: "#111827", marginTop: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 18, width: '100%', justifyContent: 'space-between' },
  editBtn: { flex: 1, marginRight: 8, backgroundColor: "#3A80F9", paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  editBtnText: { color: "#fff", fontWeight: "700" },
  deleteBtn: { flex: 1, marginLeft: 8, backgroundColor: "#FFEDED", paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FFB3B3' },
  deleteBtnText: { color: '#B91C1C', fontWeight: '700' },
});
