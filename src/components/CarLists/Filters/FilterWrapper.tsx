import { ChevronDownIcon } from '@heroicons/react/24/solid';
import React, { PropsWithChildren, useState } from 'react';

export interface FilterWrapperProps {
  title: string;
  isExpanded?: boolean;
  className?: string;
}

export default function FilterWrapper({
  children,
  title,
  isExpanded,
  onExpandedChange,
  className
}: PropsWithChildren<FilterWrapperProps> & { onExpandedChange?: (isExpanded: boolean) => void }) {
  const [expanded, setExpanded] = useState(!!isExpanded);

  return (
    <div className={`flex flex-col gap-4 p-4 ${className}`}>
      <div
        className="flex cursor-pointer justify-between"
        onClick={() => {
          const newVal = !expanded;

          setExpanded(newVal);
          onExpandedChange?.(newVal);
        }}
      >
        <h4 className="select-none text-base 2xl:text-lg">{title}</h4>
        <ChevronDownIcon
          width={24}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {expanded ? <>{children}</> : null}
    </div>
  );
}
