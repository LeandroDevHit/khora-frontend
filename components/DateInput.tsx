
import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform, View, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

function maskDate(text: string) {
  // Remove tudo que não for número
  let cleaned = text.replace(/\D/g, "");
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  let masked = cleaned;
  if (cleaned.length > 4) masked = `${cleaned.slice(0,2)}/${cleaned.slice(2,4)}/${cleaned.slice(4)}`;
  else if (cleaned.length > 2) masked = `${cleaned.slice(0,2)}/${cleaned.slice(2)}`;
  return masked;
}

export default function DateInputNative({ value, onChange }: DateInputProps) {
  const [show, setShow] = useState(false);
  let DateTimePicker: any = null;
  if (Platform.OS !== 'web') {
    // @ts-ignore
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  }

  function formatarDataParaBR(date: Date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={[styles.input, { paddingRight: 38 }]}
          placeholder="Data prevista (dd/mm/yyyy)"
          keyboardType="numeric"
          value={value}
          maxLength={10}
          onChangeText={text => {
            const masked = maskDate(text);
            onChange(masked);
          }}
        />
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={22} color="#377DFF" />
        </TouchableOpacity>
      </View>
      {show && DateTimePicker && (
        <DateTimePicker
          value={value && value.length === 10 ? new Date(value.split('/').reverse().join('-')) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={(
            event: any,
            selectedDate?: Date | undefined
          ) => {
            setShow(false);
            if (selectedDate) {
              onChange(formatarDataParaBR(selectedDate));
            }
          }}
        />
      )}
    </>
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
    paddingRight: 38, // espaço para o ícone
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 2,
  },
});
