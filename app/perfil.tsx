import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// --- Tipagem das rotas ---
type RootStackParamList = {
  Home: undefined;
  Perfil: undefined;
  Prevenção: undefined;
  Conteudo: undefined;
  SaudeMental: undefined;
  Metas: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COLORS = {
  primary: "#2f66ff",
  textDark: "#1d1d1f",
  textLight: "#999999",
  card: "#fff",
  separator: "#e0e0e0",
  background: "#f8f8f8",
};

interface TabBarItemProps {
  iconName: string;
  label: string;
  isFocused: boolean;
}

export default function Perfil() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    console.log("Desconectar clicado");
    // Aqui você pode chamar a função de logout do App
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1c1c1e" : COLORS.background },
      ]}
    >
      {/* Perfil */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/images/cara.jpg")}
          style={styles.profileImage}
        />
        <Text
          style={[
            styles.profileName,
            { color: isDarkMode ? "#fff" : COLORS.textDark },
          ]}
        >
          Meu Perfil
        </Text>
      </View>

      {/* Botões extras */}
      <View style={styles.extraButtonsContainer}>
        <TouchableOpacity style={styles.extraButton} onPress={toggleDarkMode}>
          <Icon name="moon" size={20} color={COLORS.primary} />
          <Text style={styles.extraButtonText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.extraButton} onPress={handleLogout}>
          <Icon name="exit-outline" size={20} color="red" />
          <Text style={[styles.extraButtonText, { color: "red" }]}>
            Desconectar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBarContainer}>
        <TabBarItem iconName="home" label="Home" isFocused={false} />
        <TabBarItem
          iconName="shield-checkmark"
          label="Prevenção"
          isFocused={false}
        />
        <TabBarItem iconName="book" label="Conteúdo" isFocused={false} />
        <TabBarItem iconName="brain" label="Saúde Mental" isFocused={false} />
        <TabBarItem iconName="footsteps" label="Metas" isFocused={false} />
      </View>
    </View>
  );
}

// --- TabBarItem com navegação ---
const TabBarItem: React.FC<TabBarItemProps> = ({
  iconName,
  label,
  isFocused,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const finalIconName = isFocused ? iconName : `${iconName}-outline`;
  const color = isFocused ? COLORS.primary : COLORS.textLight;

  const handlePress = () => {
    switch (label) {
      case "Home":
        navigation.navigate("Home");
        break;
      case "Prevenção":
        navigation.navigate("Prevenção");
        break;
      case "Conteúdo":
        navigation.navigate("Conteudo");
        break;
      case "Saúde Mental":
        navigation.navigate("SaudeMental");
        break;
      case "Metas":
        navigation.navigate("Metas");
        break;
    }
  };

  return (
    <TouchableOpacity
      style={styles.tabBarItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Icon name={finalIconName} size={24} color={color} />
      <Text
        style={[
          styles.tabBarLabel,
          { color, fontWeight: isFocused ? "600" : "400" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  profileContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 40,
    marginBottom: 20,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    marginBottom: 10,
  },
  profileName: { fontSize: 18, fontWeight: "600" },
  extraButtonsContainer: { marginHorizontal: 20, marginBottom: 20 },
  extraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  extraButtonText: { fontSize: 16, fontWeight: "500", marginLeft: 10 },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: Platform.OS === "ios" ? 30 : 10,
  },
  tabBarItem: { flex: 1, alignItems: "center" },
  tabBarLabel: { fontSize: 11, marginTop: 4 },
});
