import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  DimensionValue,
} from "react-native";
import {
  Colors,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/GlobalStyles";

type ButtonVariant = "primary" | "secondary";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  width?: DimensionValue;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  width = "100%",
  disabled = false,
  iconLeft,
}: CustomButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        { width: width as DimensionValue },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        <Text
          style={[
            styles.text,
            variant === "primary" ? styles.textPrimary : styles.textSecondary,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 17,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primary10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  textPrimary: {
    color: Colors.textWhite,
  },
  textSecondary: {
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
