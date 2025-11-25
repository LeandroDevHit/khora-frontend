

import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch, Modal, Pressable } from "react-native";
import { Calendar } from 'react-native-calendars';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { fetchCheckups } from "@/services/checkupService";

export default function Prevencao() {



  const router = useRouter();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacao1, setNotificacao1] = useState(true);
  const [notificacao2, setNotificacao2] = useState(false);
  const [selectedExame, setSelectedExame] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchCheckups();
        let examesArr = Array.isArray((res as any)?.data) ? (res as any).data : [];
        // Ordena por data_prevista (mais próxima primeiro)
        examesArr = examesArr
          .filter((e: any) => !!e.data_prevista)
          .sort((a: any, b: any) => new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime());
        setExames(examesArr); // agora mostra todos para o calendário
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
      {/* Header */}
      <Text style={styles.title}>Prevenção</Text>

      {/* Espaço após o título */}
      <View style={{ height: 10 }} />

      {/* Calendário de consultas */}
      <View style={{ marginBottom: 18 }}>
        {loading ? (
          <Text>Carregando exames...</Text>
        ) : exames.length === 0 ? (
          <Text>Nenhum exame encontrado.</Text>
        ) : (
          <Calendar
            style={{ borderRadius: 12, elevation: 2 }}
            theme={{
              selectedDayBackgroundColor: '#377DFF',
              todayTextColor: '#377DFF',
              arrowColor: '#377DFF',
            }}
            markedDates={exames.reduce((acc, exame) => {
              if (exame.data_prevista) {
                const dateStr = new Date(exame.data_prevista).toISOString().split('T')[0];
                acc[dateStr] = {
                  marked: true,
                  dotColor: '#377DFF',
                  activeOpacity: 0,
                  customStyles: { container: { borderRadius: 16 } },
                };
              }
              return acc;
            }, {} as any)}
            onDayPress={(day) => {
              const exame = exames.find(e => new Date(e.data_prevista).toISOString().split('T')[0] === day.dateString);
              if (exame) {
                setSelectedExame(exame);
                setModalVisible(true);
              } else {
                setSelectedExame(null);
              }
            }}
          />
        )}
      </View>

      {/* Modal de detalhes da consulta */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Consulta</Text>
            {selectedExame && (
              <>
                <Text style={styles.modalLabel}>Nome:</Text>
                <Text style={styles.modalValue}>{selectedExame.nome}</Text>
                <Text style={styles.modalLabel}>Data Prevista:</Text>
                <Text style={styles.modalValue}>{selectedExame.data_prevista ? new Date(selectedExame.data_prevista).toLocaleDateString() : ''}</Text>
                {selectedExame.local && <><Text style={styles.modalLabel}>Local:</Text><Text style={styles.modalValue}>{selectedExame.local}</Text></>}
                {selectedExame.observacao && <><Text style={styles.modalLabel}>Observação:</Text><Text style={styles.modalValue}>{selectedExame.observacao}</Text></>}
              </>
            )}
            <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Espaço após calendário */}
      <View style={{ height: 18 }} />

      {/* Botão */}
  <TouchableOpacity style={styles.button} onPress={() => router.push("/exames") }>
        <Text style={styles.buttonText}>Ver Meus Exames</Text>
      </TouchableOpacity>

      {/* Espaço após botão */}
      <View style={{ height: 18 }} />

      {/* Card explicativo */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardLink}>Por que isso importa?</Text>
        <Text style={styles.infoCardTitle}>Check-up Anual</Text>
        <Text style={styles.infoCardDesc}>
          O check-up anual é uma oportunidade para avaliar sua saúde geral e identificar possíveis problemas precocemente. Inclui exames de sangue, urina, avaliação cardíaca e consulta com um clínico geral.
        </Text>
      </View>

  {/* Espaço após card explicativo */}
  <View style={{ height: 18 }} />

  {/* Lembretes Inteligentes */}
  <Text style={styles.sectionTitle}>Lembretes Inteligentes</Text>
      <View>
        {/* Card 1 */}
        <View style={styles.reminderCardCustom}>
          <View style={styles.reminderIconBox}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#377DFF" />
          </View>
          <View style={styles.reminderTextBox}>
            <Text style={styles.reminderTitleCustom}>Notificação</Text>
            <Text style={styles.reminderDescCustom}>1 semana antes</Text>
          </View>
          <Switch
            value={notificacao1}
            onValueChange={setNotificacao1}
            trackColor={{ false: '#ccc', true: '#377DFF' }}
            thumbColor={notificacao1 ? '#fff' : '#f4f3f4'}
          />
        </View>
        {/* Card 2 */}
        <View style={styles.reminderCardCustom}>
          <View style={styles.reminderIconBox}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#377DFF" />
          </View>
          <View style={styles.reminderTextBox}>
            <Text style={styles.reminderTitleCustom}>Notificação</Text>
            <Text style={styles.reminderDescCustom}>1 dia antes</Text>
          </View>
          <Switch
            value={notificacao2}
            onValueChange={setNotificacao2}
            trackColor={{ false: '#ccc', true: '#377DFF' }}
            thumbColor={notificacao2 ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
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
    borderRadius: 16,
    padding: 24,
    width: '85%',
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#377DFF',
    alignSelf: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    color: '#222',
  },
  modalValue: {
    fontSize: 15,
    color: '#697B8C',
    marginBottom: 2,
  },
  modalButton: {
    backgroundColor: '#377DFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 0,
    alignSelf: 'center',
  },
  timelineContainer: {
    marginBottom: 18,
    marginLeft: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    minHeight: 48,
    position: 'relative',
  },
  timelineIconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineIconBg: {
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timelineIconBgActive: {
    backgroundColor: '#377DFF',
    borderColor: '#377DFF',
  },
  timelineIconBgInactive: {
    backgroundColor: '#E6F0FF',
    borderColor: '#E6F0FF',
  },
  timelineTextWrapper: {
    marginLeft: 12,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  timelineYear: {
    fontSize: 13,
    color: '#697B8C',
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    height: 38,
    backgroundColor: '#E6F0FF',
    zIndex: 1,
  },
  button: {
    backgroundColor: '#377DFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#E6F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  infoCardLink: {
    color: '#377DFF',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 13,
  },
  infoCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#222',
  },
  infoCardDesc: {
    color: '#697B8C',
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  reminderCardCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  reminderTitleCustom: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  reminderDescCustom: {
    fontSize: 13,
    color: '#B0B8C1',
    marginTop: 2,
  },
});