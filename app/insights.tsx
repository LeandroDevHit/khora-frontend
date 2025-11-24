import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Insights() {
  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Superando Hábitos</Text>

        {/* Barra de progresso */}
        <Text style={styles.progressLabel}>Progresso</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressPercent}>75%</Text>

        {/* Dias sem hábito */}
        <Text style={styles.sectionTitle}>Dias sem hábito</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBox}><Text style={styles.timeValue}>15</Text><Text style={styles.timeLabel}>Dias</Text></View>
          <View style={styles.timeBox}><Text style={styles.timeValue}>15</Text><Text style={styles.timeLabel}>Horas</Text></View>
          <View style={styles.timeBox}><Text style={styles.timeValue}>15</Text><Text style={styles.timeLabel}>Minutos</Text></View>
          <View style={styles.timeBox}><Text style={styles.timeValue}>15</Text><Text style={styles.timeLabel}>Segundos</Text></View>
        </View>

        {/* Conquistas */}
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <View style={styles.achievementsRow}>
          <View style={styles.achievementBox}><Text style={styles.achievementText}>1 semana sem o hábito</Text></View>
          <View style={styles.achievementBox}><Text style={styles.achievementText}>2 semanas sem o hábito</Text></View>
        </View>

        {/* Suporte Inteligente */}
        <Text style={styles.sectionTitle}>Suporte Inteligente</Text>
        <View style={styles.supportBox}>
          <Ionicons name="shield-checkmark-outline" size={28} color="#3B82F6" style={{marginRight: 10}} />
          <View>
            <Text style={styles.supportTitle}>Assistente de Crise</Text>
            <Text style={styles.supportDesc}>Assistência em tempo real para momentos de crise.</Text>
          </View>
        </View>

        {/* Recair */}
        <Text style={styles.relapseTitle}>Recaída?</Text>
        <Text style={styles.relapseDesc}>Recomece sua jornada sem julgamentos. Cada dia é uma nova oportunidade.</Text>
        <TouchableOpacity style={styles.restartButton}>
          <Text style={styles.restartText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 24,
    marginHorizontal: 8,
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 8,
    marginBottom: 18,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    alignSelf: 'flex-start',
    marginBottom: 2,
    marginLeft: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  progressPercent: {
    color: '#3B82F6',
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginRight: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  timeBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  achievementsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    gap: 8,
  },
  achievementBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginHorizontal: 3,
  },
  achievementText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
  },
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0EDFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    width: '100%',
    marginTop: 4,
  },
  supportTitle: {
    fontWeight: '700',
    color: '#2563EB',
    fontSize: 15,
  },
  supportDesc: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  relapseTitle: {
    fontWeight: '700',
    color: '#222',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  relapseDesc: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  restartButton: {
    backgroundColor: '#E0EDFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 0,
    width: '100%',
    alignItems: 'center',
    marginTop: 2,
  },
  restartText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 16,
  },
});
