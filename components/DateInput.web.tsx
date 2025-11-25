
import React, { useRef } from "react";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

function maskDate(text: string) {
  let cleaned = text.replace(/\D/g, "");
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  let masked = cleaned;
  if (cleaned.length > 4) masked = `${cleaned.slice(0,2)}/${cleaned.slice(2,4)}/${cleaned.slice(4)}`;
  else if (cleaned.length > 2) masked = `${cleaned.slice(0,2)}/${cleaned.slice(2)}`;
  return masked;
}

export default function DateInputWeb({ value, onChange }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // Função para abrir o input type=date ao clicar no ícone
  function openDatePicker() {
    if (dateRef.current) {
      dateRef.current.showPicker ? dateRef.current.showPicker() : dateRef.current.click();
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Data prevista (dd/mm/yyyy)"
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
        value={value}
        maxLength={10}
        onChange={e => {
          const masked = maskDate(e.target.value);
          onChange(masked);
        }}
        inputMode="numeric"
      />
      <button
        type="button"
        onClick={openDatePicker}
        style={{
          marginLeft: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: 12,
        }}
        tabIndex={-1}
        aria-label="Abrir calendário"
      >
        <svg width="22" height="22" fill="#377DFF" viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm12 18H5V8h14v12zm0-14v2H5V6h2v2h2V6h4v2h2V6h2z"></path></svg>
      </button>
      <input
        ref={dateRef}
        type="date"
        style={{ display: 'none' }}
        value={value ? value.split('/').reverse().join('-') : ''}
        min={new Date().toISOString().split('T')[0]}
        onChange={e => {
          const val = e.target.value;
          if (val) {
            const [year, month, day] = val.split('-');
            onChange(`${day}/${month}/${year}`);
          }
        }}
      />
    </div>
  );
}
