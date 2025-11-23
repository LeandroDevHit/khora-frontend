import {
    fetchForumTopics
} from "@/services/api";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Comunidade() {
  const [topics, setTopics] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchForumTopics().then(setTopics);
    // Exemplo: fetch teams, implementar conforme backend
    // fetchTeams().then(setTeams);
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Comunidade & Social</Text>
      <Text style={{ marginTop: 16, fontWeight: "bold" }}>Tópicos do Fórum:</Text>
      {topics.map((topic, idx) => (
        <View key={idx} style={{ marginVertical: 8 }}>
          <Text>{topic.title}</Text>
        </View>
      ))}
      <Text style={{ marginTop: 16, fontWeight: "bold" }}>Times:</Text>
      {teams.map((team, idx) => (
        <View key={idx} style={{ marginVertical: 8 }}>
          <Text>{team.name}</Text>
        </View>
      ))}
      {/* Adicione botões e formulários para criar tópicos, posts, times, etc. */}
    </ScrollView>
  );
}
