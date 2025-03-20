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
  defaultValue?: T;  // Renamed from defaultSelected to defaultValue for clarity
  placeholder?: string;
  value?: string;
  onChange: (value: T) => void;
  variant?: 'light' | 'dark';
  listBoxClassName?: string;
}

export function Dropdown<V, T extends BaseSelectOption<V>>(props: StylableProp<SelectProps<V, T>>) {
  // Initialize with defaultValue if provided
  const [currentSelected, setCurrentSelected] = useState<T | undefined>(props.defaultValue);

  // Update selection when props.value changes
  useEffect(() => {
    // If a value prop is provided, find the matching option
    if (props.value !== undefined) {
      const matchingOption = props.options.find(option => option.label === props.value);
      if (matchingOption) {
        setCurrentSelected(matchingOption);
      }
    }
  }, [props.value, props.options]);

  // Update when defaultValue changes
  useEffect(() => {
    if (props.defaultValue && !currentSelected) {
      setCurrentSelected(props.defaultValue);
    }
  }, [props.defaultValue, currentSelected]);

  const onSelectionChange = useCallback(
      (newValue: T) => {
        setCurrentSelected(newValue);
        props.onChange(newValue);
      },
      [props.onChange]
  );

  // Determine what text to display in the dropdown trigger
  const displayText = currentSelected?.label ||
      props.defaultValue?.label ||
      props.placeholder ||
      'Select...';

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
              className={`relative flex cursor-pointer justify-between truncate rounded-lg border bg-transparent py-3 pl-6 pr-4 text-left text-sm md:py-4 md:text-base ${
                  props.variant === 'dark'
                      ? ' border-black/30 bg-white text-black'
                      : 'border-pure-gray-400 text-white'
              } ${props.className}`}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="inline h-6 w-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className={`max-h-52 rounded-lg bg-white ${
                props.variant === 'dark' && 'border border-pure-gray/25 text-sm md:text-base '
            } ${props.listBoxClassName}`}
        >
          <div className="scrollbar flex max-h-52 w-full flex-col overflow-y-auto">
            {props.options.map((option: BaseSelectOption<V>) => (
                <DropdownMenuItem
                    key={option.id}
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
        </DropdownMenuContent>
      </DropdownMenu>
  );
}