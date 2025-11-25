import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function TabLayout() {
  // Inicializa push notifications
  const { expoPushToken } = usePushNotifications();
  console.log("Expo push token:", expoPushToken);

  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#007bff" }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="conteudo2"
        options={{
          title: "Conteúdo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="prevencao"
        options={{
          title: "Prevenção",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="saude"
        options={{
          title: "Saúde Mental",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="metas"
        options={{
          title: "Metas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" color={color} size={size} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="comunidade"
        options={{
          title: "Comunidade",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
