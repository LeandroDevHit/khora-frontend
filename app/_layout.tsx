import { AlertProvider } from "@/contexts/AlertContext";
import { UserProvider } from "@/contexts/UserContext";
import { Stack, useSegments } from "expo-router";
import React from "react";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function RootLayout() {
  const segments = useSegments();
  const isQuestRoute = segments.some((segment) => segment === "quest");

  return (
    <UserProvider>
      <AlertProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        {!isQuestRoute && <FloatingChatButton />}
      </AlertProvider>
    </UserProvider>
  );
}
