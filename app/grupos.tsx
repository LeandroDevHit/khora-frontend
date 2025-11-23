
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { gruposStyles as styles } from "../styles/grupos/GruposStyle";


export default function GruposScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => history.back && history.back()}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Grupos</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus grupos</Text>
          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Ionicons name="person" size={20} color="#888" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Desafios de Passos</Text>
              <Text style={styles.groupMembers}>4 membros</Text>
            </View>
          </View>
          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Ionicons name="person" size={20} color="#888" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Bem-estar Semanal</Text>
              <Text style={styles.groupMembers}>6 membros</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descubra grupos</Text>
          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Ionicons name="person" size={20} color="#888" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Corrida Matinal</Text>
              <Text style={styles.groupMembers}>12 membros</Text>
            </View>
            <TouchableOpacity style={styles.enterBtn}>
              <Text style={styles.enterBtnText}>Entrar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Ionicons name="person" size={20} color="#888" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Alimentação Saudável</Text>
              <Text style={styles.groupMembers}>8 membros</Text>
            </View>
            <TouchableOpacity style={styles.enterBtn}>
              <Text style={styles.enterBtnText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
