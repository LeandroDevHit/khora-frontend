import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchForumPostsByTopic } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function TopicDetail() {
  const router = useRouter();
  const params = useLocalSearchParams() as { id?: string };
  const id = params?.id;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const placeholderPosts = [
    {
      id: 'p-ex-1',
      title: 'Bem-vindo ao grupo — post de exemplo',
      content:
        'Este é um post de exemplo para demonstrar como as discussões aparecem. Sinta-se à vontade para compartilhar experiências e perguntas aqui.',
      authorName: 'Equipe Khora',
    },
    {
      id: 'p-ex-2',
      title: 'Dica rápida: pequenas práticas diárias',
      content:
        'Tente reservar 5 minutos por dia para respiração consciente. Pequenas práticas somam e ajudam no bem-estar.',
      authorName: 'Usuário (exemplo)',
    },
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchForumPostsByTopic(id)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          // se não houver posts no backend, usar placeholders para demonstrar UI
          setPosts(placeholderPosts);
        }
      })
      .catch(() => {
        // em caso de erro de rede, sempre mostrar posts de exemplo para demonstração
        setPosts(placeholderPosts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Discussão</Text>
      </View>

      {loading ? (
        <Text>Carregando posts...</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title || post.authorName || 'Post'}</Text>
            <Text style={styles.postAuthor}>{post.authorName ?? 'Khora'}</Text>
            <Text style={styles.postContent}>{post.content || post.body || post.text}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 4,
  },
  postTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
    color: '#0F172A',
  },
  postAuthor: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  postContent: {
    color: '#374151',
    lineHeight: 20,
    fontSize: 14,
  },
});
