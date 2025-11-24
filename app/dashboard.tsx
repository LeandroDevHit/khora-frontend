import { getDashboardData } from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    getDashboardData().then(setDashboard).catch(err => console.error(err));
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
      <Text style={{ marginTop: 16 }}>Dados: {JSON.stringify(dashboard)}</Text>
    </ScrollView>
  );
}
