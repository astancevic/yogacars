import React, {type JSX, type PropsWithChildren, useState} from 'react';
import type {StylableProp} from '@/util/StylableProps.ts';

export interface TextInputProps {
  suffixIcon?: JSX.Element;
  // onChange?: () => void;
}

export default function TextInput({
  suffixIcon,
  className,
  onChange,
  ...props
}: PropsWithChildren<StylableProp<TextInputProps & React.InputHTMLAttributes<HTMLInputElement>>>) {
  return (
    <div className={`form-input flex items-center rounded-lg px-6 py-2 ${className}`}>
      <input
        className="flex-1 border-0 bg-transparent outline-0 ring-0 placeholder:text-white/45 focus:outline-0 focus:ring-0"
        {...props}
        onChange={onChange}
      />
      {suffixIcon}
    </div>
  );
}
