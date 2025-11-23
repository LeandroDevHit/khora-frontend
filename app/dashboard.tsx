import { fetchAnalytics, fetchDashboard, fetchInsights } from "@/services/api";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setDashboard);
    fetchAnalytics().then(setAnalytics);
    fetchInsights().then(setInsights);
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
      <Text style={{ marginTop: 16 }}>Dashboard: {JSON.stringify(dashboard)}</Text>
      <Text style={{ marginTop: 16 }}>Analytics: {JSON.stringify(analytics)}</Text>
      <Text style={{ marginTop: 16 }}>Insights: {JSON.stringify(insights)}</Text>
    </ScrollView>
  );
}
