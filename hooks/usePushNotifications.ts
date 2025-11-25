import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

// ==== Handler global atualizado ====
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowAlert: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ==== Hook principal ====
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📨 Notificação recebida:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notificação tocada:", response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    expoPushToken,
    schedulePushNotification,
  };
}

// ==== Registro do push token ====
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert("Aviso", "Você precisa testar push notifications em um dispositivo físico.");
    return null;
  }

  // Configurar canal no Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Erro", "Permissão de notificação não concedida.");
    return null;
  }

  // 👉 Mandatory quando usa EAS Build
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.manifest2?.extra?.eas?.projectId,
  });

  console.log("📌 TOKEN GERADO:", tokenData.data);

  return tokenData.data;
}

// ==== Notificação local ====
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔔 Notificação de teste",
      body: "Funcionou a notificação local!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      repeats: false,
    },
  });
}
