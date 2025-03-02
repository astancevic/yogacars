import { cn } from '@/lib/utils';
import React, {type PropsWithChildren } from 'react';

export interface ButtonProps {
  type?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export default function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        ` ${
          props.type === 'primary' ? 'bg-primary' : 'bg-slate-400'
        } rounded px-7 py-3 font-medium text-white hover:opacity-75 active:opacity-100 ${props.className}`
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
