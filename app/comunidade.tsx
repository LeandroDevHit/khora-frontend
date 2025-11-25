import { fetchForumTopics } from "@/services/forumService";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Exemplo de grupos em destaque (sempre exibidos)
const exampleGroups = [
  {
    id: 'example-1',
    category: 'Saúde mental',
    title: 'Ansiedade e estresse',
    description: 'Compartilhe suas experiências e aprenda a lidar com a ansiedade e o estresse.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'example-2',
    category: 'Relacionamentos',
    title: 'Relacionamentos e intimidade',
    description: 'Discuta sobre relacionamentos, intimidade e como construir conexões saudáveis.',
    imageUrl: 'https://images.unsplash.com/photo-1531123414780-fc8a9c8c0f55?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'example-3',
    category: 'Saúde Física',
    title: 'Saúde sexual',
    description: 'Converse sobre saúde sexual, disfunção erétil e outros temas relacionados.',
    imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'example-4',
    category: 'Bem-Estar',
    title: 'Bem-estar e autocuidado',
    description: 'Aprenda sobre práticas de autocuidado e como melhorar seu bem-estar geral.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
  },
];

export default function Comunidade() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await fetchForumTopics();
        // manter os tópicos reais (se existirem)
        setTopics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('fetchForumTopics falhou — mostrando apenas exemplos locais', err);
        setTopics([]);
      }
    }
    loadTopics();
    // Exemplo: fetch teams, implementar conforme backend
    // fetchTeams().then(setTeams);
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
      {/* Header */}
      <View style={localStyles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>Espaços de discussão</Text>
      </View>

      <Text style={localStyles.headerDescription}>
        Participe de grupos moderados por profissionais de saúde, onde você pode compartilhar suas experiências de forma anônima e segura.
      </Text>

      <Text style={localStyles.sectionTitle}>Grupos em destaque</Text>

      {/* Grupos de exemplo sempre visíveis */}
      {exampleGroups.map((g) => (
        <TouchableOpacity
          key={g.id}
          onPress={() => router.push(`/comunidade/${g.id}`)}
          activeOpacity={0.85}
          style={localStyles.groupCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={localStyles.groupCategory}>{g.category}</Text>
            <Text style={localStyles.groupTitle}>{g.title}</Text>
            <Text style={localStyles.groupDescription}>{g.description}</Text>
          </View>
          <Image source={{ uri: g.imageUrl }} style={localStyles.groupImage} />
        </TouchableOpacity>
      ))}

      {/* Tópicos vindos do backend (se houver) */}
      {topics.length > 0 && (
        <>
          <Text style={[localStyles.sectionTitle, { marginTop: 18 }]}>Tópicos recentes</Text>
          {topics.map((topic: any, idx: number) => (
            <TouchableOpacity
              key={topic.id ?? idx}
              onPress={() => router.push(`/comunidade/${topic.id}`)}
              style={{ marginVertical: 8 }}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#1F2937', fontWeight: '600' }}>{topic.title}</Text>
              {topic.description ? <Text style={{ color: '#6B7280' }}>{topic.description}</Text> : null}
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Times (se existirem) */}
      {teams.length > 0 && (
        <>
          <Text style={[localStyles.sectionTitle, { marginTop: 18 }]}>Times</Text>
          {teams.map((team, idx) => (
            <View key={idx} style={{ marginVertical: 8 }}>
              <Text>{team.name}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 6,
  },
  headerDescription: {
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  groupCategory: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    marginBottom: 6,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  groupDescription: {
    color: '#6B7280',
    fontSize: 13,
  },
  groupImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    marginLeft: 12,
    backgroundColor: '#EEF2FF',
  },
});
