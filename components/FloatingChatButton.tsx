import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  useWindowDimensions,
} from "react-native";
import { useRouter, useSegments } from "expo-router";

const AVATAR = require("@/assets/images/bot.jpg");

export default function FloatingChatButton() {
  const router = useRouter();
  const segments = useSegments();
  const { width } = useWindowDimensions();

  // Hide the button on specific routes: perfil, chat, welcome, and auth flows (login/register/two-factor)
  const hideRoutes = [
    "perfil",
    "chat",
    "welcome",
    "auth",
    "login",
    "register",
    "two-factor-auth",
    "twofactor",
    "twofactorauth",
  ];
  if (segments.some((s) => hideRoutes.includes(s))) return null;

  const goToChat = () => router.push("/chat");

  const SIZE = width > 720 ? 72 : 62;
  const bottomOffset = width > 720 ? 24 : Platform.OS === "web" ? 62 : 74; // sit above tabbar on mobile/web

  return (
    <View pointerEvents="box-none" style={[styles.container, { bottom: bottomOffset, right: 18 }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={goToChat} style={[styles.outer, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]}>
        <View style={[styles.halo, { width: SIZE + 8, height: SIZE + 8, borderRadius: (SIZE + 8) / 2 }]} />
        <Image source={AVATAR} style={[styles.avatar, { width: SIZE - 12, height: SIZE - 12, borderRadius: (SIZE - 12) / 2 }]} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
    elevation: 20,
  },
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    backgroundColor: "rgba(58,128,249,0.12)",
  },
  avatar: {
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#3A80F9",
  },
  badge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: { color: "#3A80F9", fontWeight: "700" },
});
