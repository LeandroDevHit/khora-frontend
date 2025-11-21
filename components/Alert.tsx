import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
  showCloseButton?: boolean;
}

const COLORS = {
  success: {
    background: "#E8F5E9",
    border: "#4CAF50",
    text: "#2E7D32",
    icon: "#4CAF50",
  },
  error: {
    background: "#FFEBEE",
    border: "#F44336",
    text: "#C62828",
    icon: "#F44336",
  },
  warning: {
    background: "#FFF3E0",
    border: "#FF9800",
    text: "#E65100",
    icon: "#FF9800",
  },
  info: {
    background: "#E3F2FD",
    border: "#2196F3",
    text: "#1565C0",
    icon: "#2196F3",
  },
};

const ICONS = {
  success: "check-circle",
  error: "error",
  warning: "warning",
  info: "info",
};

export default function Alert({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  showIcon = true,
  showCloseButton = true,
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(-150); // Começa acima da tela
  const opacityAnim = new Animated.Value(0); // Começa invisível

  useEffect(() => {
    // Animação de entrada: desce devagar
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss após o tempo definido
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onClose?.();
    });
  };

  if (!visible) return null;

  const colors = COLORS[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          borderLeftColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        {showIcon && (
          <MaterialIcons
            name={ICONS[type] as any}
            size={24}
            color={colors.icon}
            style={styles.icon}
          />
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>
        </View>

        {showCloseButton && (
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={25} color={colors.icon} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 5,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
