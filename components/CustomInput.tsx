import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Pressable,
  TextInputProps,
  DimensionValue,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Colors,
  BorderRadius,
  FontSizes,
  Spacing,
} from "../constants/GlobalStyles";

interface CustomInputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  width?: DimensionValue;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  isPassword?: boolean;
}

const CustomInput = ({
  placeholder = "Digite aqui...",
  value,
  onChangeText,
  width = "100%",
  iconName,
  isPassword = false,
  secureTextEntry,
  ...rest
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldHideText = isPassword && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        styles.container,
        { width },
        isFocused && styles.containerFocused,
      ]}
    >
      {iconName && (
        <View style={styles.iconLeft}>
          <MaterialIcons
            name={iconName}
            size={20}
            color={isFocused ? Colors.primary : Colors.textSecondary}
          />
        </View>
      )}

      <TextInput
        style={[
          styles.input,
          iconName && styles.inputWithIcon,
          isPassword && styles.inputWithPasswordToggle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={shouldHideText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />

      {isPassword && (
        <Pressable style={styles.iconRight} onPress={togglePasswordVisibility}>
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={20}
            color={isFocused ? Colors.primary : Colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    height: 56,
    paddingHorizontal: Spacing.md,
  },

  containerFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  iconLeft: {
    marginRight: Spacing.sm + 4,
  },

  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },

  inputWithIcon: {
    paddingLeft: 0,
  },

  inputWithPasswordToggle: {
    paddingRight: 0,
  },

  iconRight: {
    marginLeft: Spacing.sm + 4,
    padding: Spacing.xs,
  },
});

export default CustomInput;
