
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { programasStyles as styles } from "../styles/programas/ProgramasStyle";


const programa = {
  // image: require("../assets/images/meditacao.jpg"),
  title: "Jornada de 21 dias para meditar",
  desc: "Encontre paz interior e reduza o estresse com meditações guiadas.",
};

const recompensas = [
  {
    icon: <MaterialCommunityIcons name="meditation" size={20} color="#3A80F9" />, name: "Recompensa: Paz Interior", desc: "Complete 7 dias de meditação"
  },
  {
    icon: <MaterialCommunityIcons name="water" size={20} color="#3A80F9" />, name: "Recompensa: Energia Renovada", desc: "Beba 2 litros de água por dia"
  },
  {
    icon: <Ionicons name="barbell-outline" size={20} color="#3A80F9" />, name: "Recompensa: Corpo Forte", desc: "Faça 3 treinos de força"
  },
];

export default function ProgramasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => history.back && history.back()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Programas</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programas Guiados</Text>
          <View style={styles.card}>
            {/* <Image source={programa.image} style={styles.cardImage} resizeMode="cover" /> */}
            <Text style={styles.cardTitle}>{programa.title}</Text>
            <Text style={styles.cardDesc}>{programa.desc}</Text>
          </View>
          <Text style={styles.rewardsTitle}>Recompensas e Marcos</Text>
          {recompensas.map((r, i) => (
            <View style={styles.rewardCard} key={i}>
              <View style={styles.rewardIcon}>{r.icon}</View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{r.name}</Text>
                <Text style={styles.rewardDesc}>{r.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
