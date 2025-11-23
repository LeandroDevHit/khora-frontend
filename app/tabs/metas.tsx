import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
// Removida importação de 'fetchUserMetas' que não é usada neste bloco
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function MetasScreen() { // Mantendo MetasScreen como nome
  const [pesoAtual, setPesoAtual] = useState<number>(75);
  const [metaPeso, setMetaPeso] = useState<number>(70);

  const data = [80, 75, 78, 74, 76, 72];

  useEffect(() => {
    // load real data here if needed
  }, []);

  // Garantir que a porcentagem não exceda 100%
  const progressPercent = Math.min(100, ((pesoAtual - metaPeso) / (80 - metaPeso)) * 100); // Lógica de progresso baseada em peso

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Defina suas metas</Text>
        <Text style={styles.subtitle}>Escolha o que você quer alcançar e acompanhe seu progresso.</Text>

        <View style={styles.pillsRow}>
          <TouchableOpacity style={[styles.pill, styles.pillActive]}>
            <Text style={[styles.pillText, styles.pillActiveText]}>perder peso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillText}>Ganhar massa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bigPill}>
          <Text style={styles.bigPillText}>melhorar condicionamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigPill}>
          <Text style={styles.bigPillText}>manter a forma</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Acompanhe seu progresso</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Peso</Text>
              <Text style={styles.pesoVal}>{pesoAtual}Kg</Text>
              <Text style={styles.ultMes}>Últimos 3 meses</Text>
            </View>
            <View style={styles.trend}> 
              <Text style={styles.trendTxt}>-2%</Text>
              <Ionicons name="trending-down" size={18} color="#ff4d4f" />
            </View>
          </View>

          <LineChart
            data={data.map(v => ({ value: v }))}
            color="#3A80F9"
            thickness={3}
            hideRules
            hideYAxisText
            startFillColor="#3A80F9"
            endFillColor="#3A80F900"
            startOpacity={0.12}
            endOpacity={0}
            curved
            height={140}
          />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>meta de peso</Text>
            <Text style={styles.metaValue}>{metaPeso}Kg</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.metaHelper}>Faltam {Math.max(0, pesoAtual - metaPeso)}kg para a sua meta</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Salvar metas</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Atalhos</Text>

        <View style={styles.atalhosRow}>
          <View style={styles.atalhoItem}>
            <View style={styles.atalhoIconWrap}><Ionicons name="book" size={20} color="#3A80F9" /></View>
            <Text style={styles.atalhoTxt}>Programas</Text>
          </View>

          <View style={styles.atalhoItem}>
            <View style={styles.atalhoIconWrap}><Ionicons name="trophy" size={20} color="#3A80F9" /></View>
            <Text style={styles.atalhoTxt}>Conquistas</Text>
          </View>

          <View style={styles.atalhoItem}>
            <View style={styles.atalhoIconWrap}><Ionicons name="people" size={20} color="#3A80F9" /></View>
            <Text style={styles.atalhoTxt}>Grupos</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 80, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6, color: '#0f172a' },
  subtitle: { color: '#6b7280', marginBottom: 18 },
  pillsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  pill: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: '#e6eefb', backgroundColor: '#fff' },
  pillText: { color: '#334155', textTransform: 'lowercase' },
  pillActive: { backgroundColor: '#3A80F9', borderColor: '#3A80F9' },
  pillActiveText: { color: '#fff' },
  bigPill: { marginTop: 6, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: '#eef2ff', backgroundColor: '#fff', alignItems: 'center', marginBottom: 10 },
  bigPillText: { color: '#6b7280' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 18, marginBottom: 10, color: '#0f172a' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 14, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  pesoVal: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  ultMes: { fontSize: 12, color: '#94a3b8' },
  trend: { alignItems: 'center' },
  trendTxt: { color: '#ff4d4f', fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  metaLabel: { color: '#6b7280' },
  metaValue: { fontWeight: '700' },
  progressBar: { width: '100%', height: 8, backgroundColor: '#eef2ff', borderRadius: 10, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: '#3A80F9' },
  metaHelper: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  saveBtn: { backgroundColor: '#3A80F9', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  atalhosRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  atalhoItem: { alignItems: 'center', flex: 1 },
  atalhoIconWrap: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#eaf4ff', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  atalhoTxt: { color: '#334155', fontSize: 12 },
});