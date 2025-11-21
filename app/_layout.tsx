import { AlertProvider } from "@/contexts/AlertContext";
import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <UserProvider>
      <AlertProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="perfil" />
          <Stack.Screen name="quest" />
        </Stack>
      </AlertProvider>
    </UserProvider>
  );
}
