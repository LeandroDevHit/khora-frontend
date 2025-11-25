import React from "react";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DateInputWeb({ value, onChange }: DateInputProps) {
  return (
    <input
      type="date"
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 15,
        width: '100%',
        height: 40,
      }}
      value={value ? value.split('/').reverse().join('-') : ''}
      onChange={e => {
        const val = e.target.value;
        if (val) {
          const [year, month, day] = val.split('-');
          onChange(`${day}/${month}/${year}`);
        } else {
          onChange('');
        }
      }}
      min={new Date().toISOString().split('T')[0]}
    />
  );
}
