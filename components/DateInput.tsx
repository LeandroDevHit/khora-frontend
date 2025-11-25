import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
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
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={{ color: value ? '#222' : '#888', fontSize: 15 }}>
          {value ? value : 'Data prevista (dd/mm/yyyy)'}
        </Text>
      </TouchableOpacity>
      {show && DateTimePicker && (
        <DateTimePicker
          value={value ? new Date(value.split('/').reverse().join('-')) : new Date()}
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
  },
});
