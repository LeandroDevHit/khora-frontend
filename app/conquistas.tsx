
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { conquistasStyles as styles } from "../styles/conquistas/ConquistasStyle";


const conquistas = [
  {
    icon: <MaterialCommunityIcons name="medal" size={24} color="#3A80F9" />, name: "Mestre do Peso", desc: "7 dias de registro", progress: 1
  },
  {
    icon: <MaterialIcons name="commit" size={24} color="#3A80F9" />, name: "Comprometido", desc: "10 registros de peso", progress: 1
  },
  {
    icon: <Ionicons name="book-outline" size={24} color="#3A80F9" />, name: "Leitor Voraz", desc: "5 artigos lidos", progress: 1
  },
  {
    icon: <MaterialIcons name="check-circle-outline" size={24} color="#3A80F9" />, name: "Realizador", desc: "3 metas cumpridas", progress: 1
  },
];

export default function ConquistasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => history.back && history.back()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Conquistas</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {conquistas.map((c, i) => (
            <View style={styles.card} key={i}>
              <View style={styles.iconWrap}>{c.icon}</View>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.desc}>{c.desc}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${c.progress * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
