import type {StylableProp} from '@/util/StylableProps';
import React, { useEffect, useState } from 'react';
import type {ChecklistItem} from './ChecklistFilter';

interface ChecklistItemProps extends ChecklistItem {
  labelClass?: string;
  checkboxClass?: string;

  onChange?: (checked: boolean) => void;
}

export default function Checkbox(props: StylableProp<ChecklistItemProps>) {
  const [isChecked, setIsChecked] = useState<boolean>();

  useEffect(() => {
    setIsChecked(props.checked);
  }, [props.checked]);

  const handleCheck = () => {
    const newValue = !isChecked;

    setIsChecked(newValue);

    props.onChange?.(newValue);
  };

  return (
    <label className={`flex items-center gap-1 ${props.className}`}>
      <input
        className={`rounded border-black/85 text-primary focus:outline-0 focus:ring-0 active:outline-none active:ring-0 ${props.checkboxClass}`}
        type={'checkbox'}
        value={props.value}
        checked={isChecked}
        onChange={handleCheck}
      />{' '}
      <div title={props.label} className={`mx-0.5 align-middle ${props.labelClass}`}>
        {props.label}
      </div>
    </label>
  );
}
