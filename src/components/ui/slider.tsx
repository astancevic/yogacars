import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';
import { ValueFormat, formatValue } from '../CarLists/Filters/RangeFilter';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  format: ValueFormat;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
  // React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, format, ...props }, ref) => {
  const value = props.value || props.defaultValue;
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-0.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-slate-300 ">
        <SliderPrimitive.Range className="absolute h-full  bg-primary" />
      </SliderPrimitive.Track>
      {/* <div className="w-10 bg-red-500"> */}
      {value?.map((thumbValue, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-6 w-6 cursor-pointer rounded-full border-2 border-primary bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 lg:h-5 lg:w-5"
        >
          <span className="absolute -left-3.5 right-0 top-0 mx-auto -mt-6  w-14 text-nowrap rounded bg-pure-gray/85 p-1 text-center text-[10px] text-white lg:-left-2 lg:w-11 lg:text-[8px]">
            {formatValue(thumbValue, format)}
          </span>
        </SliderPrimitive.Thumb>
      ))}
      {/* </div> */}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
