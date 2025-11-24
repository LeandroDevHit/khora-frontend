

import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { fetchCheckups } from "@/services/checkupService";

export default function Prevencao() {



  const router = useRouter();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacao1, setNotificacao1] = useState(true);
  const [notificacao2, setNotificacao2] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchCheckups();
        // Se o backend retorna { success, data }, use res.data
  setExames(Array.isArray((res as any)?.data) ? (res as any).data : []);
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

  {/* Timeline de exames */}
      <View style={styles.timelineContainer}>
        {loading ? (
          <Text>Carregando exames...</Text>
        ) : exames.length === 0 ? (
          <Text>Nenhum exame encontrado.</Text>
        ) : (
          exames.map((exame, idx) => (
            <View key={exame.id} style={styles.timelineItem}>
              {/* Linha vertical */}
              {idx < exames.length - 1 && (
                <View style={[styles.timelineLine, { top: 32, left: 19 }]} />
              )}
              {/* Ícone */}
              <View style={styles.timelineIconWrapper}>
                <View style={[
                  styles.timelineIconBg,
                  idx === 0
                    ? styles.timelineIconBgActive
                    : styles.timelineIconBgInactive,
                ]}>
                  <Ionicons
                    name={exame.icon ? exame.icon : "calendar-outline"}
                    size={24}
                    color={idx === 0 ? '#fff' : '#377DFF'}
                  />
                </View>
              </View>
              {/* Texto */}
              <View style={styles.timelineTextWrapper}>
                <Text style={styles.timelineTitle}>{exame.nome}</Text>
                <Text style={styles.timelineYear}>{exame.data_prevista ? new Date(exame.data_prevista).getFullYear() : ""}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Espaço após timeline */}
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