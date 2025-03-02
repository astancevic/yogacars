import React, { useCallback } from 'react';

export interface InputFieldProps {
  label?: string;
  value?: string | number;
  type?: string;
  onChange?: (value: string | number) => void;
  onBlur?: (value: string | number) => void;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  value,
  onChange,
  onBlur,
  type,
  handleKeyPress
}: InputFieldProps) {
  return (
    <div className="field">
      {label && <label htmlFor="minValue">{label}</label>}
      <input
        type={type || 'text'}
        className="my-1 w-full rounded border-black/40 text-pure-gray focus:border-black/40 focus:outline-0 focus:ring-0  active:ring-0"
        name="minValue"
        id="minValue"
        value={value}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDownCapture={handleKeyPress}
      />
    </div>
  );
}
