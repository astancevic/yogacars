import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type {StylableProp} from '@/util/StylableProps.ts';
// import { ScrollArea } from '../ui/scroll-area';

export interface BaseSelectOption<V = string | number | boolean> {
  id: string | number;
  label: string;
  value: V;
}

export interface SelectProps<V, T extends BaseSelectOption<V>> {
  options: T[];
  defaultSelected?: T;
  placeholder?: string;
  value?: string;
  onChange: (value: T) => void;
  variant?: 'light' | 'dark';
  listBoxClassName?: string;
}

export function Dropdown<V, T extends BaseSelectOption<V>>(props: StylableProp<SelectProps<V, T>>) {
  const [currentSelected, setCurrentSelected] = useState(props.defaultSelected);

  useEffect(() => {
    setCurrentSelected(props.defaultSelected);
  }, [props.defaultSelected]);

  const onSelectionChange = useCallback(
    (newValue: T) => {
      setCurrentSelected(newValue);
      props.onChange(newValue);
    },
    [props.onChange]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant={'link'}>Open</Button> */}
        <button
          className={`relative flex  cursor-pointer justify-between truncate rounded-lg  border bg-transparent py-3 pl-6 pr-4 text-left text-sm md:py-4 md:text-base ${
            props.variant === 'dark'
              ? ' border-black/30 bg-white text-black'
              : 'border-pure-gray-400 text-white'
          } ${props.className}`}
        >
          <>
            {currentSelected
              ? currentSelected.label
              : props.defaultSelected
                ? props.defaultSelected.label
                : props.placeholder}
            <ChevronDown className="inline h-6 w-6" />
          </>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`max-h-52 rounded-lg bg-white ${
          props.variant === 'dark' && 'border border-pure-gray/25 text-sm md:text-base '
        } ${props.listBoxClassName}`}
      >
        {/* <ScrollArea type="always"> */}
        <div className="scrollbar flex max-h-52 w-full flex-col overflow-y-auto">
          {props.options.map((option: BaseSelectOption<V>) => (
            <DropdownMenuItem
              key={option.id}
              // value={option}
              onClick={() => onSelectionChange(option as T)}
              className={`w-full cursor-pointer px-2 py-3 ${
                currentSelected?.value === option.value &&
                (props.variant === 'dark' ? 'text-primary ' : 'bg-primary text-white')
              } `}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </div>
        {/* </ScrollArea> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
