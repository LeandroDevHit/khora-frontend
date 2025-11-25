import * as Linking from 'expo-linking';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const KHORA_COLORS = {
  primary: "#3b82f6",
  darkText: "#334D6E",
  secondaryText: "#697B8C",
  lightBlueBg: "#E6F0FF",
  cardBg: "#FFFFFF",
  divider: "#F1F5F9",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KHORA_COLORS.cardBg,
  },
  titleWrapper: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32,
    color: KHORA_COLORS.darkText,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 90,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginRight: 28,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  tagButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: KHORA_COLORS.primary,
    paddingBottom: 3,
  },
  tagText: {
    fontSize: 16,
    fontWeight: "600",
    color: KHORA_COLORS.secondaryText,
  },
  tagTextActive: {
    color: KHORA_COLORS.darkText,
    fontWeight: "700",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: KHORA_COLORS.divider,
    backgroundColor: KHORA_COLORS.cardBg,
  },
  textWrapper: {
    flex: 1,
    paddingRight: 20,
  },
  typeTag: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    backgroundColor: '#2196F3',
    color: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: KHORA_COLORS.darkText,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: KHORA_COLORS.secondaryText,
    lineHeight: 20,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: KHORA_COLORS.divider,
    overflow: "hidden",
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sourceText: {
    fontSize: 12,
    color: '#697B8C',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: KHORA_COLORS.secondaryText,
    fontSize: 15,
  },
});

interface Noticia {
  title: string;
  description: string;
  image: string;
  url: string;
  source?: { name?: string };
  publishedAt?: string;
}

const TAGS = [
  "Todos",
  "Saúde Sexual",
  "Próstata",
  "Saúde Mental",
  "Nutrição",
];

export default function Conteudo2() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState("Todos");

  useEffect(() => {
    async function fetchNoticias() {
      setLoading(true);
      try {
        const res = await fetch('https://gnews.io/api/v4/search?q=saúde%20masculina&lang=pt&max=10&token=6bad04f0031163c67d7ecd9ac59184ff');
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          setNoticias(data.articles);
        } else {
          setNoticias([]);
        }
      } catch (err) {
        setError('Erro ao buscar notícias.');
        setNoticias([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNoticias();
  }, []);

  // Palavras-chave por tag
  const TAG_KEYWORDS: Record<string, string[]> = {
    'Saúde Sexual': ['sexual', 'sexo', 'ereção', 'libido', 'impotência'],
    'Próstata': ['próstata', 'urinário', 'prostatite', 'câncer de próstata'],
    'Saúde Mental': ['mental', 'psicologia', 'emoção', 'ansiedade', 'depressão', 'psiquiatria', 'cérebro'],
    'Nutrição': ['nutrição', 'alimentação', 'dieta', 'nutriente', 'vitamina', 'proteína', 'carboidrato'],
  };

  const noticiasFiltradas = activeTag === 'Todos'
    ? noticias
    : noticias.filter(n => {
        const keywords = TAG_KEYWORDS[activeTag] || [activeTag.toLowerCase()];
        const text = `${n.title} ${n.description}`.toLowerCase();
        return keywords.some(kw => text.includes(kw));
      });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleWrapper}>
        <Text style={styles.mainTitle}>Arsenal do Conhecimento</Text>
      </View>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tagRow}>
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagButton, activeTag === tag && styles.tagButtonActive]}
              onPress={() => setActiveTag(tag)}
            >
              <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={KHORA_COLORS.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : noticiasFiltradas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum conteúdo encontrado.</Text>
        ) : (
          noticiasFiltradas.map((noticia, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.cardContainer}
              activeOpacity={0.85}
              onPress={() => {
                if (noticia.url) {
                  Linking.openURL(noticia.url);
                }
              }}
            >
              <View style={styles.textWrapper}>
                <Text style={styles.typeTag}>ARTIGO</Text>
                <Text style={styles.title}>{noticia.title}</Text>
                <Text style={styles.description}>{noticia.description}</Text>
                <Text style={styles.sourceText}>{noticia.source?.name} {!!noticia.publishedAt && `• ${new Date(noticia.publishedAt).toLocaleDateString()}`}</Text>
              </View>
              <View style={styles.imagePlaceholder}>
                {noticia.image ? (
                  <Image style={styles.image} source={{ uri: noticia.image }} />
                ) : (
                  <Text style={{ color: '#ccc', fontSize: 10 }}>Sem imagem</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
