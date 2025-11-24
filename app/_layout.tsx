import { AlertProvider } from "@/contexts/AlertContext";
import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import React from "react";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function RootLayout() {
  return (
    <UserProvider>
      <AlertProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <FloatingChatButton />
      </AlertProvider>
    </UserProvider>
  );
}
