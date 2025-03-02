import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency, formatNumber } from '../formatCurrency';
import FilterWrapper, {type FilterWrapperProps } from './FilterWrapper';
import InputField from './InputField';
import { Slider } from '@/components/ui/slider';

export type ValueFormat = 'number' | 'currency' | 'distance' | 'year';

interface RangeFilterProps extends FilterWrapperProps {
  minRange: number;
  maxRange: number;

  minValue?: number;
  maxValue?: number;

  step?: number;

  rangeSelectorLabel?: string;
  minLabel?: string;
  maxLabel?: string;

  format: ValueFormat;

  onChange: (min: number, max: number) => void;
}

export default function RangeFilter(props: RangeFilterProps) {
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();

  // const [minValue, setMinValue] = useState(props.minValue || props.minRange);
  // const [maxValue, setMaxValue] = useState(props.maxValue || props.maxRange);

  useEffect(() => {
    setMinValue(props.minValue || props.minRange);
    setMaxValue(props.maxValue || props.maxRange);
  }, [props.minValue, props.maxValue, props.maxRange, props.minRange]);

  const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);

  const handleSliderChange = useCallback(
    (min: number, max: number) => {
      setMinValue(min);
      setMaxValue(max);
      // props.onChange(min, max);
    },
    [props.onChange, minValue, maxValue]
  );

  // const handleInputChange = useCallback(
  //   (min: number, max: number) => {
  //     if (!isNaN(min) && !isNaN(max) && typeof min === 'number' && typeof max === 'number') {
  //       setMinValue(() => min);
  //       setMaxValue(() => max);
  //       props.onChange(min, max);
  //     }
  //   },
  //   [props.onChange]
  // );
  const handleMaxInputChange = useCallback(
    (value: string | number) => {
      let max = Number(value) || 0;

      if (isNaN(max) || max === undefined) {
        max = maxValue || 0;
      }

      if (max <= minValue!) {
        max = minValue ? minValue + 1 : 1;
      }

      if (max > props.maxRange) {
        max = props.maxRange;
      }

      if (max < props.minRange || max === undefined) {
        max = props.minRange + 1;
      }
      if (
        !isNaN(minValue!) &&
        !isNaN(max) &&
        typeof minValue === 'number' &&
        typeof max === 'number'
      ) {
        setMinValue(() => minValue);
        setMaxValue(() => max);
        props.onChange(minValue, max);
      }
    },
    [props.onChange, maxValue, minValue]
  );
  const handleMinInputChange = useCallback(
    (value: string | number) => {
      let min = Number(value) || 0;

      if (isNaN(min) || min === undefined) {
        min = minValue || 0;
      }

      if (min >= maxValue!) {
        min = maxValue ? maxValue - 1 : 0;
      }

      if (min < props.minRange) {
        min = props.minRange;
      }

      if (
        !isNaN(min) &&
        !isNaN(maxValue!) &&
        typeof min === 'number' &&
        typeof maxValue === 'number'
      ) {
        setMinValue(() => min);
        setMaxValue(() => maxValue);
        props.onChange(min, maxValue);
      }
    },
    [props.onChange, maxValue, minValue]
  );

  const handleMaxInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleMaxInputChange(maxValue!);
      }
    },
    [maxValue, handleMaxInputChange]
  );
  const handleMinInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleMinInputChange(minValue!);
      }
    },
    [minValue, handleMinInputChange]
  );

  // const formattedMinValue = useMemo(
  //   () => formatValue(minValue!, props.format),
  //   [minValue, props.minValue, props.minRange, props.format]
  // );

  // const formattedMaxValue = useMemo(
  //   () => formatValue(maxValue!, props.format),
  //   [maxValue, props.maxValue, props.maxRange, props.format]
  // );

  return (
    <FilterWrapper
      title={props.title}
      className={`range-filter ${props.className}`}
      isExpanded={props.isExpanded}
      onExpandedChange={(value) => setFiltersVisible(value)}
    >
      <div className={`${filtersVisible ? 'flex' : 'hidden'} flex-col gap-2`}>
        <h5 className="text-sm">{props.rangeSelectorLabel}</h5>

        <Slider
          className="mt-5"
          min={props.minRange}
          max={props.maxRange}
          value={[minValue ?? props.minRange, maxValue ?? props.maxRange]}
          step={props.step ?? 1}
          minStepsBetweenThumbs={1}
          format={props.format}
          onValueChange={([min, max]) => handleSliderChange(min, max)}
          onValueCommit={([min, max]) => props.onChange(min, max)}
        />
      </div>

      <div className={`${filtersVisible ? 'flex' : 'hidden'} gap-4`}>
        <InputField
          label={props.minLabel}
          type="number"
          value={minValue}
          onBlur={(value) => {
            handleMinInputChange(value);
          }}
          handleKeyPress={(e) => handleMinInputKeyPress(e)}
          onChange={(value) => setMinValue(Number(value))}
        />

        <InputField
          label={props.maxLabel}
          value={maxValue}
          type="number"
          onBlur={(value) => {
            handleMaxInputChange(value);
          }}
          handleKeyPress={(e) => handleMaxInputKeyPress(e)}
          onChange={(value) => setMaxValue(Number(value))}
        />
      </div>
    </FilterWrapper>
  );
}

export function formatValue(value: number | string, format: ValueFormat) {
  switch (format) {
    case 'currency':
      return formatCurrency(value);

    case 'number':
      if (typeof value === 'string') {
        value = parseFloat(value);
      }

      return formatNumber(value);

    case 'distance':
      if (typeof value === 'string') {
        value = parseFloat(value);
      }

      return `${formatNumber(value, 0)} mi`;

    case 'year':
      if (typeof value === 'string') {
        value = parseFloat(value);
      }

      return `${value?.toFixed(0)}`;

    // let magnitude = 0;

    // while (value >= 1000) {
    //   value /= 1000;
    //   magnitude++;
    // }

    // return `${Math.round(value)}${MAGNITUDE_POSTFIX[magnitude]} mi`;
  }
}

// function sanitizeValue(value: string, format: ValueFormat) {
//   switch (format) {
//     case 'currency':
//       return parseFloat(value.replace(/[\$,]/gi, ''));

//     case 'number':
//       return parseFloat(value.replace(/[\,]/gi, ''));

//     case 'distance':
//       return parseFloat(value.replace(/[\,]/gi, '').replace(/\smi$/gi, ''));

//     case 'year':
//       return parseFloat(value);
//   }

//   return 0;
// }

// const MAGNITUDE_POSTFIX = ['', 'k', 'M', 'G'];
