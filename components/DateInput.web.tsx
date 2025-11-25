import React from "react";
import { TextInput, StyleSheet } from "react-native";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DateInputWeb({ value, onChange }: DateInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Data prevista (dd/mm/yyyy)"
      value={value}
      onChangeText={onChange}
      maxLength={10}
      inputMode="numeric"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
});
