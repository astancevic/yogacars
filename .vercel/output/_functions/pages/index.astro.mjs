import { c as createComponent, r as renderTemplate, b as renderHead, e as renderComponent, f as renderSlot, m as maybeRenderHead } from '../chunks/astro/server_C8Ft_gEr.mjs';
import 'kleur/colors';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useLayoutEffect, memo, useMemo, useEffect, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRight, Check, Circle } from 'lucide-react';
import { create } from 'zustand';
import debounce from 'lodash/debounce.js';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function createChecklistItemList(data, preselected) {
  let items = [];
  if (data.length && typeof data[0] === "string") {
    items = data.map((item) => ({ name: item }));
  } else {
    items = [...data];
  }
  return items.reduce((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected) ? preselected.includes(item.name) : item.name === preselected
      });
    }
    return list;
  }, []);
}
function createModelsChecklistItemList(data, preselected) {
  return data.reduce((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected) ? preselected.includes(item.name) : item.name === preselected,
        parent: item.makeName
      });
    }
    return list;
  }, []);
}
function createTrimChecklistItemList(data, preselected) {
  return data?.trim?.reduce((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected) ? preselected.includes(item.name) : item.name === preselected,
        parent: item.model.name
      });
    }
    return list;
  }, []);
}
function getSearchParam(name, searchParam) {
  return searchParam.get(name)?.split(",").map((item) => item.replace(/_/g, " "));
}
function hasAnyFilterValue(filterState) {
  for (const key in filterState) {
    const value = filterState[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return true;
      }
    } else if (key === "price" || key === "miles" || key === "year") {
      if (typeof value === "object" && (value.min !== void 0 || value.max !== void 0)) {
        return true;
      }
    } else if (value !== void 0) {
      return true;
    }
  }
  return false;
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

const carsLogos = [
  { src: "public/assets/images/svg/Chevrolet_logo.svg", name: "Chevrolet", className: "lg:block" },
  { src: "public/assets/images/svg/KIA_logo.svg", name: "Kia", className: "lg:block" },
  { src: "public/assets/images/svg/gmc.svg", name: "GMC", className: "lg:block" },
  { src: "public/assets/images/svg/Ford_logo.svg", name: "Ford", className: "lg:block" },
  { src: "public/assets/images/svg/Volkswagen_logo.svg", name: "Volkswagen", className: "lg:block" },
  { src: "public/assets/images/svg/Hyundai_logo.svg", name: "Hyundai", className: "lg:block" },
  { src: "public/assets/images/svg/Mazda_logo.svg", name: "Mazda", className: "lg:block" },
  { src: "public/assets/images/svg/Jeep_logo.svg", name: "Jeep", className: "lg:block" },
  { src: "public/assets/images/svg/subaru.svg", name: "Subaru", className: "lg:block" },
  { src: "public/assets/images/svg/Nissan_logo.svg", name: "Nissan", className: "lg:block" },
  { src: "public/assets/images/svg/buick.svg", name: "Buick", className: "lg:block" },
  { src: "public/assets/images/svg/dodge.svg", name: "Dodge", className: "xl:block" },
  { src: "public/assets/images/svg/genesis.svg", name: "Genesis", className: "1xl:block" },
  { src: "public/assets/images/svg/chrysler.svg", name: "Chrysler", className: "3xl:block" },
  { src: "public/assets/images/svg/ram.svg", name: "Ram", className: "1xl:block" }
];
const Branding = memo(({ className, logosClassName }) => {
  const [screenWidth] = useWindowSize();
  return /* @__PURE__ */ jsx("div", { className: " mx-auto  hidden h-14 w-fit  items-center justify-center  overflow-hidden px-2 lg:flex lg:gap-8 ", children: carsLogos.map((item, index) => /* @__PURE__ */ jsx(
    "a",
    {
      "aria-label": `New ${item.name} in Quincy, MA`,
      href: `/new-${item.name.toLowerCase()}-quincy-ma/`,
      className: `hidden cursor-pointer ${item.className}`,
      children: /* @__PURE__ */ jsx("img", { src: item.src, alt: item.name, className: cn(`hidden cursor-pointer ${item.className}`, logosClassName) })
    },
    index
  )) });
});

function PlaceholderCard() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md overflow-hidden rounded-2xl shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl  md:max-xl:last:hidden", children: [
    /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "aspect-h-9 aspect-w-15 !block" }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-b-2xl bg-white p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between whitespace-nowrap text-sm text-pure-gray text-opacity-60", children: [
        /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "w-32" }),
        /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "w-12" })
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-xl font-medium", children: /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "w-48" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-md text-pure-gray text-opacity-60", children: /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "w-24" }) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsx("h2", { className: "text-right text-lg font-semibold text-primary", children: /* @__PURE__ */ jsx(PlaceholderSpan$1, { className: "w-24 bg-primary-50" }) }) })
    ] })
  ] });
}
const PlaceholderSpan$1 = (props) => {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "span",
    {
      className: `relative inline-block overflow-hidden rounded bg-gray-100 ${props.className} after:absolute after:-left-full after:top-0 after:h-full after:animate-glimmer after:shadow-[0_0_25px_9px_rgba(254,254,254)] after:content-['_']`,
      children: " "
    }
  ) });
};

function PlaceholderListViewCard() {
  return /* @__PURE__ */ jsxs("div", { className: "flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl lg:p-3 xl:max-h-52", children: [
    /* @__PURE__ */ jsx(PlaceholderSpan, { className: "!block h-full w-full min-w-28 rounded-xl lg:min-w-32 lg:max-w-60" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full rounded-b-2xl bg-white p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between whitespace-nowrap text-xs text-pure-gray text-opacity-60 2xl:text-sm", children: [
        /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-32" }),
        /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-12" })
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-base font-medium sm:text-lg lg:text-2xl 3xl:text-3xl", children: /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-48" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-pure-gray text-opacity-60 sm:text-sm lg:text-base 3xl:text-lg ", children: /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-24" }) })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "sm:text-basis text-xs text-pure-gray/65 lg:text-xs 3xl:text-sm", children: /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-24" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-right text-base font-semibold text-primary sm:text-lg lg:text-2xl 3xl:text-3xl", children: /* @__PURE__ */ jsx(PlaceholderSpan, { className: "w-24 bg-primary-50" }) })
      ] })
    ] })
  ] });
}
const PlaceholderSpan = (props) => {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "span",
    {
      className: `relative inline-block overflow-hidden rounded bg-gray-100 ${props.className} after:absolute after:-left-full after:top-0 after:h-full after:animate-glimmer after:shadow-[0_0_25px_9px_rgba(254,254,254)] after:content-['_']`,
      children: " "
    }
  ) });
};

function PlaceholderBlock(props) {
  const [items, setItems] = useState(new Array(props.count).fill("test"));
  return /* @__PURE__ */ jsx(Fragment, { children: items.map(
    (item, index) => props.selectedView === "grid" ? /* @__PURE__ */ jsx(PlaceholderCard, {}, index) : /* @__PURE__ */ jsx(PlaceholderListViewCard, {}, index)
  ) });
}

function useFormatCurrency(amount) {
  return useMemo(() => formatCurrency(amount), [amount]);
}
function formatCurrency(amount) {
  const value = parseFloat(amount?.toString());
  if (isNaN(value)) {
    return `$0`;
  }
  const num = formatNumber(value);
  return `$${num.substring(0, num.length - 2)}`;
}
function formatNumber(number, decimals = 1) {
  let value = number?.toFixed(decimals === 0 ? 1 : decimals).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  if (decimals === 0) {
    value = value?.substring(0, value.length - 2);
  }
  return value;
}

function CarListCard({
  heroImageUrl,
  year,
  make,
  model,
  trim,
  invoice,
  type,
  vin,
  miles,
  dealerCity,
  dealerState,
  className,
  onClick
}) {
  const price = useFormatCurrency(invoice ?? 0);
  const aspectRatio = " aspect-w-4 aspect-h-3";
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `/listing/${vin}`,
      className: `w-full max-w-md cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl ${className}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: `${aspectRatio} bg-gray-100 flex items-end justify-center`, children: heroImageUrl ? /* @__PURE__ */ jsx(
          "img",
          {
            className: "object-cover w-full h-full",
            src: heroImageUrl,
            alt: `${year} ${make} ${model}`
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "No Image" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-b-2xl bg-white p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between whitespace-nowrap text-xs text-pure-gray/65 2xl:text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: type }),
            /* @__PURE__ */ jsxs("span", { children: [
              formatNumber(miles ?? 0, 0),
              " mi"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "mt-1 truncate text-base font-medium text-black 2xl:text-lg", children: [
              year,
              " ",
              make,
              " ",
              model
            ] }),
            /* @__PURE__ */ jsx("span", { className: "block w-11/12 truncate text-xs text-black/80 2xl:text-sm", children: trim?.length ? trim : /* @__PURE__ */ jsx(Fragment, { children: " " }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-pure-gray/65 2xl:text-xs", children: [
              dealerCity,
              ", ",
              dealerState
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-right text-base font-semibold text-primary 2xl:text-lg", children: price === "$0" ? "Call" : price })
          ] })
        ] })
      ]
    }
  );
}

function CarsListBlock({
  error,
  isFetching,
  isLoadMore,
  vehicleList,
  BATCH_SIZE
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${" car-list-block grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  min-[2000px]:grid-cols-5 " } `,
      children: error ? /* @__PURE__ */ jsxs("div", { className: "col-span-full text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl", children: "Oops" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg", children: "We ran into an unexpected error and couldn't recover." }),
        /* @__PURE__ */ jsx("p", { className: "whitespace-pre font-mono text-red-600", children: error.message })
      ] }) : isFetching && !isLoadMore ? /* @__PURE__ */ jsx(
        PlaceholderBlock,
        {
          count: BATCH_SIZE,
          selectedView: "grid" 
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        vehicleList.map((vehicle, index) => {
          return /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            CarListCard,
            {
              heroImageUrl: "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUS04_640/2024SUS040102_640_01.jpg",
              vin: vehicle.vin,
              invoice: vehicle.sellingPrice,
              year: vehicle.year,
              type: vehicle.type,
              miles: vehicle.mileage,
              make: vehicle.make_name,
              model: vehicle.model_name,
              trim: vehicle.trim,
              dealerCity: vehicle.dealerCity,
              dealerState: vehicle.dealerState,
              className: "block"
            },
            vehicle.vin
          ) }) }, index);
        }),
        isLoadMore && /* @__PURE__ */ jsx(
          PlaceholderBlock,
          {
            count: BATCH_SIZE,
            selectedView: "grid" 
          }
        )
      ] })
    }
  );
}

function FilterWrapper({
  children,
  title,
  isExpanded,
  onExpandedChange,
  className
}) {
  const [expanded, setExpanded] = useState(!!isExpanded);
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-4 p-4 ${className}`, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex cursor-pointer justify-between",
        onClick: () => {
          const newVal = !expanded;
          setExpanded(newVal);
          onExpandedChange?.(newVal);
        },
        children: [
          /* @__PURE__ */ jsx("h4", { className: "select-none text-base 2xl:text-lg", children: title }),
          /* @__PURE__ */ jsx(
            ChevronDownIcon,
            {
              width: 24,
              className: `transition-transform ${expanded ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    expanded ? /* @__PURE__ */ jsx(Fragment, { children }) : null
  ] });
}

function InputField({
  label,
  value,
  onChange,
  onBlur,
  type,
  handleKeyPress
}) {
  return /* @__PURE__ */ jsxs("div", { className: "field", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: "minValue", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: type || "text",
        className: "my-1 w-full rounded border-black/40 text-pure-gray focus:border-black/40 focus:outline-0 focus:ring-0  active:ring-0",
        name: "minValue",
        id: "minValue",
        value,
        onBlur: (e) => onBlur && onBlur(e.target.value),
        onChange: (e) => onChange?.(e.target.value),
        onKeyDownCapture: handleKeyPress
      }
    )
  ] });
}

const Slider = React.forwardRef(({ className, format, ...props }, ref) => {
  const value = props.value || props.defaultValue;
  return /* @__PURE__ */ jsxs(
    SliderPrimitive.Root,
    {
      ref,
      className: cn("relative flex w-full touch-none select-none items-center", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-0.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-slate-300 ", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full  bg-primary" }) }),
        value?.map((thumbValue, i) => /* @__PURE__ */ jsx(
          SliderPrimitive.Thumb,
          {
            className: "block h-6 w-6 cursor-pointer rounded-full border-2 border-primary bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 lg:h-5 lg:w-5",
            children: /* @__PURE__ */ jsx("span", { className: "absolute -left-3.5 right-0 top-0 mx-auto -mt-6  w-14 text-nowrap rounded bg-pure-gray/85 p-1 text-center text-[10px] text-white lg:-left-2 lg:w-11 lg:text-[8px]", children: formatValue(thumbValue, format) })
          },
          i
        ))
      ]
    }
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

function RangeFilter(props) {
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();
  useEffect(() => {
    setMinValue(props.minValue || props.minRange);
    setMaxValue(props.maxValue || props.maxRange);
  }, [props.minValue, props.maxValue, props.maxRange, props.minRange]);
  const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);
  const handleSliderChange = useCallback(
    (min, max) => {
      setMinValue(min);
      setMaxValue(max);
    },
    [props.onChange, minValue, maxValue]
  );
  const handleMaxInputChange = useCallback(
    (value) => {
      let max = Number(value) || 0;
      if (isNaN(max) || max === void 0) {
        max = maxValue || 0;
      }
      if (max <= minValue) {
        max = minValue ? minValue + 1 : 1;
      }
      if (max > props.maxRange) {
        max = props.maxRange;
      }
      if (max < props.minRange || max === void 0) {
        max = props.minRange + 1;
      }
      if (!isNaN(minValue) && !isNaN(max) && typeof minValue === "number" && typeof max === "number") {
        setMinValue(() => minValue);
        setMaxValue(() => max);
        props.onChange(minValue, max);
      }
    },
    [props.onChange, maxValue, minValue]
  );
  const handleMinInputChange = useCallback(
    (value) => {
      let min = Number(value) || 0;
      if (isNaN(min) || min === void 0) {
        min = minValue || 0;
      }
      if (min >= maxValue) {
        min = maxValue ? maxValue - 1 : 0;
      }
      if (min < props.minRange) {
        min = props.minRange;
      }
      if (!isNaN(min) && !isNaN(maxValue) && typeof min === "number" && typeof maxValue === "number") {
        setMinValue(() => min);
        setMaxValue(() => maxValue);
        props.onChange(min, maxValue);
      }
    },
    [props.onChange, maxValue, minValue]
  );
  const handleMaxInputKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleMaxInputChange(maxValue);
      }
    },
    [maxValue, handleMaxInputChange]
  );
  const handleMinInputKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleMinInputChange(minValue);
      }
    },
    [minValue, handleMinInputChange]
  );
  return /* @__PURE__ */ jsxs(
    FilterWrapper,
    {
      title: props.title,
      className: `range-filter ${props.className}`,
      isExpanded: props.isExpanded,
      onExpandedChange: (value) => setFiltersVisible(value),
      children: [
        /* @__PURE__ */ jsxs("div", { className: `${filtersVisible ? "flex" : "hidden"} flex-col gap-2`, children: [
          /* @__PURE__ */ jsx("h5", { className: "text-sm", children: props.rangeSelectorLabel }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              className: "mt-5",
              min: props.minRange,
              max: props.maxRange,
              value: [minValue ?? props.minRange, maxValue ?? props.maxRange],
              step: props.step ?? 1,
              minStepsBetweenThumbs: 1,
              format: props.format,
              onValueChange: ([min, max]) => handleSliderChange(min, max),
              onValueCommit: ([min, max]) => props.onChange(min, max)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${filtersVisible ? "flex" : "hidden"} gap-4`, children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: props.minLabel,
              type: "number",
              value: minValue,
              onBlur: (value) => {
                handleMinInputChange(value);
              },
              handleKeyPress: (e) => handleMinInputKeyPress(e),
              onChange: (value) => setMinValue(Number(value))
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: props.maxLabel,
              value: maxValue,
              type: "number",
              onBlur: (value) => {
                handleMaxInputChange(value);
              },
              handleKeyPress: (e) => handleMaxInputKeyPress(e),
              onChange: (value) => setMaxValue(Number(value))
            }
          )
        ] })
      ]
    }
  );
}
function formatValue(value, format) {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "number":
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      return formatNumber(value);
    case "distance":
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      return `${formatNumber(value, 0)} mi`;
    case "year":
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      return `${value?.toFixed(0)}`;
  }
}

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-slate-200 dark:bg-slate-800" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

let navigateOnServerWarned = false;
async function navigate(href, options) {
  {
    if (!navigateOnServerWarned) {
      const warning = new Error(
        "The view transitions client API was called during a server side render. This may be unintentional as the navigate() function is expected to be called in response to user interactions. Please make sure that your usage is correct."
      );
      warning.name = "Warning";
      console.warn(warning);
      navigateOnServerWarned = true;
    }
    return;
  }
}

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-slate-100 data-[state=open]:bg-slate-100 dark:focus:bg-slate-800 dark:data-[state=open]:bg-slate-800",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-green-200 focus:text-primary-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const sortList = [
  { id: 4, value: "Newest", label: "Newest" },
  { id: 1, value: "Highest Price", label: "Highest Price" },
  { id: 2, value: "Lowest Price", label: "Lowest Price" },
  { id: 3, value: "Highest Mileage", label: "Highest Mileage" },
  { id: 5, value: "Lowest Mileage", label: "Lowest Mileage" }
];

const useYogaCarStore = create((set, get) => ({
  selectedView: "grid",
  setSelectedView: (view) => {
    set(() => ({ selectedView: view }));
  },
  selectedSortOption: void 0,
  setSelectedSortOption(newSelection) {
    set(() => ({ selectedSortOption: newSelection }));
  },
  selectedFiltersState: void 0,
  setSelectedFiltersState: (newState) => {
    set(() => ({ selectedFiltersState: { ...newState } }));
  },
  priceRange: void 0,
  setPriceRange(newPriceRange) {
    set(() => ({ priceRange: newPriceRange }));
  },
  priceRangeValue: void 0,
  setPriceRangeValue(newPriceRangeValue) {
    set(() => ({ priceRangeValue: newPriceRangeValue }));
  },
  milesRange: void 0,
  setMilesRange(newMilesRange) {
    set(() => ({ milesRange: newMilesRange }));
  },
  milesRangeValue: void 0,
  setMilesRangeValue(newMilesRangeValue) {
    set(() => ({ milesRangeValue: newMilesRangeValue }));
  },
  yearRange: void 0,
  setYearRange(newYearRange) {
    set(() => ({ yearRange: newYearRange }));
  },
  yearRangeValue: void 0,
  setYearRangeValue(newYearRangeValue) {
    set(() => ({ yearRangeValue: newYearRangeValue }));
  },
  makeList: void 0,
  setMakeList(newMakeList) {
    set(() => ({ makeList: newMakeList }));
  },
  modelList: void 0,
  setModelList(newModelList) {
    set(() => ({ modelList: newModelList }));
  },
  locationList: void 0,
  setLocationList(newLocationList) {
    set(() => ({ locationList: newLocationList }));
  },
  trimList: void 0,
  setTrimList(newTrimList) {
    set(() => ({ trimList: newTrimList }));
  },
  fuelTypeList: void 0,
  setFuelTypeList(newFuelTypeList) {
    set(() => ({ fuelTypeList: newFuelTypeList }));
  },
  drivetrainList: void 0,
  setDrivetrainList(newDrivetrainList) {
    set(() => ({ drivetrainList: newDrivetrainList }));
  },
  transmissionList: void 0,
  setTransmissionList(newTransmissionList) {
    set(() => ({ transmissionList: newTransmissionList }));
  },
  bodyTypeList: void 0,
  setBodyTypeList(newBodyTypeList) {
    set(() => ({ bodyTypeList: newBodyTypeList }));
  },
  exteriorColorList: void 0,
  setExteriorColorList(newExteriorColorList) {
    set(() => ({ exteriorColorList: newExteriorColorList }));
  },
  interiorColorList: void 0,
  setInteriorColorList(newInteriorColorList) {
    set(() => ({ interiorColorList: newInteriorColorList }));
  },
  typeList: void 0,
  setTypeList(newTypeList) {
    set(() => ({ typeList: newTypeList }));
  },
  carCondition: "new",
  setCarCondition(newCarCondition) {
    set(() => ({ carCondition: newCarCondition }));
  },
  applyingFilter: void 0,
  setApplyingFilter(newApplyingFilter) {
    set(() => ({ applyingFilter: newApplyingFilter }));
  },
  contextMake: "*",
  setContextMake: (newContextMake) => set({ contextMake: newContextMake }),
  contextModel: "*",
  setContextModel: (newContextModel) => set({ contextModel: newContextModel }),
  contextBodyType: "*",
  setContextBodyType: (newContextBodyType) => set({ contextBodyType: newContextBodyType }),
  removeItem(key, valueToRemove, range) {
  },
  readParam: (searchParam, maxPriceParam, contextMake, contextModel, contextBodyType, queryResult, handleFilterStateChange) => {
    if (searchParam.size > 0 || maxPriceParam) {
      const sortParam = searchParam.get("sort");
      const sortValue = sortList.filter((list) => {
        if (list.value === sortParam?.replace("_", " ")) {
          return list;
        } else {
          return void 0;
        }
      });
      get().setSelectedSortOption(sortValue[0]);
      const data = {};
      const paramsToExtract = [
        "make",
        "model",
        "location",
        "trim",
        "drivetrain",
        "fuelType",
        "bodyType",
        "exteriorColor",
        "interiorColor",
        "type"
      ];
      paramsToExtract.forEach((param) => {
        const paramValue = getSearchParam(param, searchParam);
        if (paramValue)
          data[param] = paramValue;
      });
      const modelParam = getSearchParam("model", searchParam);
      const modelFiltered = modelParam?.flatMap(
        (model) => queryResult.allModel.nodes.map((item) => {
          if (item.name === model) {
            return { name: item.name, parent: item.makeName };
          }
        }).filter((item) => item !== void 0)
      );
      const uniqueModel = modelFiltered?.reduce(
        (acc, current) => {
          if (!acc.some((item) => item?.name === current?.name)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );
      if (uniqueModel && uniqueModel?.length > 0) {
        data.model = uniqueModel;
      }
      const trimParam = getSearchParam("trim", searchParam);
      if (get().trimList === void 0) {
        if (trimParam && trimParam.length > 0) {
          data.trim = trimParam?.map((item) => ({ name: item, parent: void 0 }));
        }
      } else {
        const trimFiltered = trimParam?.flatMap(
          (trim) => get().trimList?.map((item) => {
            if (item.value === trim) {
              return { name: item.value, parent: item.parent };
            }
          }).filter((item) => item !== void 0)
        );
        if (trimFiltered && trimFiltered.length > 0) {
          data.trim = trimFiltered;
        }
      }
      const minPrice = Number(searchParam.get("minPrice"));
      const maxPrice = maxPriceParam ? maxPriceParam : Number(searchParam.get("maxPrice"));
      const priceParam = minPrice || maxPrice ? {
        min: minPrice === 0 ? queryResult.priceRange.min ?? 0 : minPrice,
        max: maxPrice === 0 ? Math.ceil((queryResult.priceRange.max ?? 1e5) / 1e4) * 1e4 : maxPrice
      } : void 0;
      const minMiles = Number(searchParam.get("minMiles"));
      const maxMiles = Number(searchParam.get("maxMiles"));
      const milesParam = minMiles || maxMiles ? {
        min: minMiles === 0 ? queryResult.milesRange.min ?? 0 : minMiles,
        max: maxMiles === 0 ? Math.ceil((queryResult.milesRange.max ?? 1e5) / 100) * 100 : maxMiles
      } : void 0;
      const minYear = Number(searchParam.get("minYear"));
      const maxYear = Number(searchParam.get("maxYear"));
      const yearParam = minYear || maxYear ? {
        min: minYear === 0 ? queryResult.yearRange.min ?? 2016 : minYear,
        max: maxYear === 0 ? queryResult.yearRange.max ?? 2024 : maxYear
      } : void 0;
      if (priceParam) data.price = priceParam;
      if (milesParam) data.miles = milesParam;
      if (yearParam) data.year = yearParam;
      get().setSelectedFiltersState(data);
      handleFilterStateChange(data);
      get().setPriceRangeValue([data.price?.min, maxPriceParam ?? data.price?.max]);
      get().setMilesRangeValue([data.miles?.min, data.miles?.max]);
      get().setYearRangeValue([data.year?.min, data.year?.max]);
      get().setMakeList(createChecklistItemList(queryResult.allMake.nodes, data.make));
      get().setModelList(
        createModelsChecklistItemList(
          queryResult.allModel.nodes,
          data?.model?.map((item) => item?.name)
        )
      );
      get().setLocationList(createChecklistItemList(queryResult.locations.distinct, data.location));
      const trimArray = get().trimList?.map((item) => ({
        name: item.value,
        model: { name: item.parent }
      }));
      get().setTrimList(
        createTrimChecklistItemList(
          { trim: trimArray },
          data?.trim?.map((item) => item?.name)
        )
      );
      get().setFuelTypeList(createChecklistItemList(queryResult.fuelType.distinct, data.fuelType));
      get().setBodyTypeList(
        createChecklistItemList(
          queryResult.bodyType?.distinct?.filter((item) => {
            if (!!item.length) {
              if (item !== "unknown") return item;
            }
          }),
          data.bodyType
        )
      );
      get().setExteriorColorList(
        createChecklistItemList(queryResult.exteriorColor?.distinct, data.exteriorColor)
      );
      get().setInteriorColorList(
        createChecklistItemList(queryResult.interiorColor?.distinct, data.interiorColor)
      );
      get().setDrivetrainList(
        createChecklistItemList(queryResult.drivetrain.distinct, data.drivetrain)
      );
      get().setTypeList(createChecklistItemList(queryResult.type.distinct, data.type));
      get().setPriceRange([
        queryResult.priceRange.min ?? 0,
        Math.ceil((queryResult.priceRange.max ?? 1e5) / 1e4) * 1e4
      ]);
      get().setMilesRange([
        queryResult.milesRange.min ?? 0,
        Math.ceil((queryResult.milesRange.max ?? 1e5) / 100) * 100
      ]);
      get().setYearRange([queryResult.yearRange.min ?? 2016, queryResult.yearRange.max ?? 2024]);
    } else {
      get().setApplyingFilter(void 0);
      get().setSelectedFiltersState(void 0);
      get().setSelectedSortOption(void 0);
      get().setPriceRangeValue(void 0);
      get().setMakeList(createChecklistItemList(queryResult.allMake.nodes, contextMake));
      get().setModelList(
        createModelsChecklistItemList(
          queryResult.allModel.nodes.filter((node) => {
            if (contextMake && contextMake !== "*") {
              return node.makeName === contextMake;
            }
            return true;
          }),
          contextModel
        )
      );
      get().setLocationList(createChecklistItemList(queryResult.locations.distinct));
      get().setFuelTypeList(
        createChecklistItemList(queryResult.fuelType.distinct.filter((item) => !!item.length))
      );
      get().setDrivetrainList(
        createChecklistItemList(queryResult.drivetrain.distinct.filter((item) => !!item.length))
      );
      get().setTransmissionList(
        createChecklistItemList(queryResult.transmission.distinct.filter((item) => !!item.length))
      );
      get().setBodyTypeList(
        createChecklistItemList(
          queryResult.bodyType?.distinct?.filter((item) => {
            if (!!item.length) {
              if (item !== "unknown") return item;
            }
          }),
          contextBodyType
        )
      );
      get().setExteriorColorList(
        createChecklistItemList(queryResult.exteriorColor.distinct.filter((item) => !!item.length))
      );
      get().setInteriorColorList(
        createChecklistItemList(queryResult.interiorColor.distinct.filter((item) => !!item.length))
      );
      get().setTypeList(
        createChecklistItemList(queryResult.type.distinct.filter((item) => !!item.length))
      );
      get().setPriceRange([
        queryResult.priceRange.min ?? 0,
        Math.ceil((queryResult.priceRange.max ?? 1e5) / 1e4) * 1e4
      ]);
      get().setMilesRange([
        queryResult.milesRange.min ?? 0,
        Math.ceil((queryResult.milesRange.max ?? 1e5) / 100) * 100
      ]);
      get().setYearRange([queryResult.yearRange.min ?? 0, queryResult.yearRange.max ?? 2024]);
    }
  },
  setParamAction: (searchParam, maxPriceParam, contextMake, contextModel, contextBodyType, handleFilterStateChange, data, sort, clearAll) => {
    console.log(111);
    const keysToDelete = [];
    searchParam.forEach((value, key) => keysToDelete.push(key));
    keysToDelete.forEach((key) => searchParam.delete(key));
    let stringQuery = null;
    if (clearAll) {
      searchParam.forEach((value, key) => {
        searchParam.delete(key);
      });
      navigate(`/${get().carCondition}-vehicles-quincy-ma/`);
      return;
    }
    if (sort) {
      searchParam.set("sort", sort.label.replace(/ /g, "_"));
    }
    if (contextMake !== "*" && contextMake !== void 0) {
      searchParam.set("make", contextMake);
    }
    if (contextModel !== "*" && contextModel !== void 0) {
      searchParam.set("model", contextModel);
    }
    if (contextBodyType) {
      searchParam.set("bodyType", contextBodyType);
    }
    if (data && hasAnyFilterValue(data)) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "price") {
          const { min, max } = value;
          min !== get().priceRange?.[0] && searchParam.set("minPrice", min);
          max !== get().priceRange?.[1] && searchParam.set("maxPrice", max);
        } else if (key === "miles") {
          const { min, max } = value;
          min !== get().milesRange?.[0] ? searchParam.set("minMiles", min) : searchParam.delete("minMiles");
          max !== get().milesRange?.[1] ? searchParam.set("maxMiles", max) : searchParam.delete("maxMiles");
        } else if (key === "year") {
          const { min, max } = value;
          min !== get().yearRange?.[0] ? searchParam.set("minYear", min) : searchParam.delete("minYear");
          max !== get().yearRange?.[1] ? searchParam.set("maxYear", max) : searchParam.delete("maxYear");
        } else if (key === "model") {
          if (value.filter((item) => item !== void 0).length > 0) {
            searchParam.set(
              "model",
              value.map((item) => item?.name)
            );
          }
        } else if (key === "trim") {
          if (value?.filter((item) => item !== void 0).length > 0) {
            searchParam.set(
              "trim",
              value.map((item) => item?.name)
            );
          }
        } else {
          const valueString = Array.isArray(value) ? value.map((item) => item?.replace(/ /g, "_")).join(",") : value?.replace(/ /g, "_");
          if (valueString.length > 0) {
            searchParam.set(key, valueString);
          }
        }
      });
    }
    searchParam.forEach((value, key) => {
      stringQuery ? stringQuery += `&${key}=${value}` : stringQuery = `${key}=${value}`;
    });
    if (contextModel !== "*" || contextMake !== "*") {
      stringQuery ? (
        // ? history.pushState({}, '', `/new-vehicles-quincy-ma/?${stringQuery}`)
        // : history.pushState({}, '', '/new-vehicles-quincy-ma/');
        navigate(`/${get().carCondition}-vehicles-quincy-ma/?${stringQuery}`)
      ) : navigate(`/${get().carCondition}-vehicles-quincy-ma/`);
    } else {
      stringQuery ? navigate(`/${get().carCondition}-vehicles-quincy-ma/?${stringQuery}`) : navigate(`/${get().carCondition}-vehicles-quincy-ma/`);
    }
  },
  handleFilterStateChangeAction: async (contextMake, contextModel, queryResult, state, take, skip, sortOption) => {
    const filters = {
      where: {},
      whereTrim: {},
      orderBy: [],
      take: take ?? 24,
      skip: skip ?? 0
    };
    console.log(1111);
    if (get().selectedFiltersState) state = get().selectedFiltersState;
    sortOption = get().selectedSortOption;
    if (sortOption?.value === "Highest Price") {
      filters.orderBy = [{ sellingPrice: { sort: "desc" } }];
    }
    if (sortOption?.value === "Lowest Price") {
      filters.orderBy = [{ sellingPrice: { sort: "asc" } }];
    }
    if (sortOption?.value === "Newest") {
      filters.orderBy = [{ year: { sort: "desc" } }];
    }
    if (sortOption?.value === "Highest Mileage") {
      filters.orderBy = [{ miles: { sort: "desc" } }];
    }
    if (sortOption?.value === "Lowest Mileage") {
      filters.orderBy = [{ miles: { sort: "asc" } }];
    }
    if (state?.price) {
      filters.where.sellingPrice = {
        gte: state.price.min,
        lte: state.price.max
      };
    }
    if (state?.make?.length) {
      filters.where.make = {
        is: {
          name: {
            in: state?.make
          }
        }
      };
      filters.whereTrim.make = {
        is: {
          name: {
            in: state?.make
          }
        }
      };
      const filteredModelList = queryResult.allModel.nodes.filter((node) => {
        if (node.makeName && state?.make?.includes(node.makeName)) {
          return true;
        }
        return false;
      });
      const uniqueModels = filteredModelList.reduce(
        (acc, current) => {
          if (!acc.some((item) => item.name === current.name)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );
      get().setModelList(
        createModelsChecklistItemList(
          uniqueModels,
          state?.model?.map((item) => item?.name)
        )
      );
    } else {
      if (get().modelList?.length !== queryResult.allModel.nodes.length) {
        get().setModelList(
          createModelsChecklistItemList(
            queryResult.allModel.nodes,
            state?.model?.map((item) => item?.name)
          )
        );
      }
    }
    const models = state?.model?.map((item) => item?.name);
    if (models && models?.length > 0) {
      filters.where.model = {
        is: {
          name: {
            in: models
          }
        }
      };
      filters.whereTrim.model = {
        is: {
          name: {
            in: models
          }
        }
      };
    } else if (contextModel && contextModel !== "*") {
      filters.whereTrim.model = {
        is: {
          name: {
            in: [contextModel]
          }
        }
      };
    }
    if (state?.location?.length) {
      filters.where.dealerCity = {
        in: state?.location
      };
    }
    const trims = state?.trim?.map((item) => item?.name).filter((item) => item !== void 0);
    if (trims && trims.length > 0) {
      filters.where.trim = {
        in: trims
      };
    }
    if (state?.miles) {
      filters.where.miles = {
        gte: state?.miles.min,
        lte: state?.miles.max
      };
    }
    if (state?.year) {
      filters.where.year = {
        gte: state?.year.min,
        lte: state?.year.max
      };
    }
    if (state?.fuelType?.length) {
      filters.where.fuelType = {
        in: state?.fuelType
      };
    }
    if (state?.bodyType?.length) {
      filters.where.bodyType = {
        in: state?.bodyType
      };
    }
    if (state?.transmission?.length) {
      filters.where.transmission = {
        in: state?.transmission
      };
    }
    if (state?.drivetrain?.length) {
      filters.where.drivetrain = {
        in: state?.drivetrain
      };
    }
    if (state?.exteriorColor?.length) {
      filters.where.extColorGeneric = {
        in: state?.exteriorColor
      };
    }
    if (state?.interiorColor?.length) {
      filters.where.intColorGeneric = {
        in: state?.interiorColor
      };
    }
    filters.where.type = {
      in: [get().carCondition === "new" ? "New" : "Used"]
    };
    filters.where.dealerNetwork = {
      equals: "quirk"
    };
    filters.whereTrim.dealerNetwork = {
      equals: "quirk"
    };
    if (!filters.orderBy?.length) {
      filters.orderBy = [{ dateInStock: "desc" }, { updatedAt: "desc" }];
    }
    get().setApplyingFilter(filters);
  }
}));

function useDebounce(callback, timer = 500) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  const debouncedCallback = useMemo(() => {
    const func = (...args) => {
      ref.current?.(...args);
    };
    return debounce(func, timer);
  }, []);
  return debouncedCallback;
}

function Checkbox(props) {
  const [isChecked, setIsChecked] = useState();
  useEffect(() => {
    setIsChecked(props.checked);
  }, [props.checked]);
  const handleCheck = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    props.onChange?.(newValue);
  };
  return /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-1 ${props.className}`, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        className: `rounded border-black/85 text-primary focus:outline-0 focus:ring-0 active:outline-none active:ring-0 ${props.checkboxClass}`,
        type: "checkbox",
        value: props.value,
        checked: isChecked,
        onChange: handleCheck
      }
    ),
    " ",
    /* @__PURE__ */ jsx("div", { title: props.label, className: `mx-0.5 align-middle ${props.labelClass}`, children: props.label })
  ] });
}

function ChecklistFilter(props) {
  const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);
  const handleSelectionChange = useCallback(
    (item, checked) => {
      const checkedItems = props.items?.filter((e) => e.checked).map((e) => e.value) ?? [];
      let updatedList = [...checkedItems];
      if (checked) {
        updatedList = [...checkedItems, item.value];
      } else {
        updatedList.splice(checkedItems.indexOf(item.value), 1);
      }
      props.onChange(Array(...new Set(updatedList)));
      const updatedItems = props?.items?.map((prevItem) => {
        if (prevItem.value === item.value) {
          return { ...prevItem, checked };
        } else {
          return { ...prevItem };
        }
      });
      props.setItems && props.setItems(updatedItems);
    },
    [props.items, props.onChange, props.setItems]
  );
  const sortedItems = useMemo(() => {
    const uniqueValues = props.items?.reduce((acc, current) => {
      if (!acc.some((item) => item.value === current.value)) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueValues?.sort((a, b) => a.label.localeCompare(b.label));
  }, [props.items]);
  return /* @__PURE__ */ jsx(
    FilterWrapper,
    {
      title: props.title,
      className: `checklist-filter ${props.className}`,
      isExpanded: props.isExpanded,
      onExpandedChange: (value) => setFiltersVisible(value),
      children: /* @__PURE__ */ jsx(ScrollArea, { type: "always", children: !props.showItem ? /* @__PURE__ */ jsx("p", { children: props.message }) : /* @__PURE__ */ jsx("div", { className: `${filtersVisible ? "flex" : "hidden"}  max-h-48 min-h-8 flex-col`, children: sortedItems?.length > 0 ? sortedItems.map((item, index) => /* @__PURE__ */ jsx(
        Checkbox,
        {
          className: "my-1.5 w-11/12 cursor-pointer text-base leading-8 md:text-sm md:leading-5",
          labelClass: "text-black/85 truncate",
          label: item.label,
          value: item.value,
          checked: item.checked,
          onChange: (isChecked) => handleSelectionChange(item, isChecked)
        },
        item.label + index.toString()
      )) : `No ${props.title} to show` }) })
    }
  );
}

function ConditionFilter() {
  const carCondition = useYogaCarStore((state) => state.carCondition);
  const setCarCondition = useYogaCarStore((state) => state.setCarCondition);
  const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
  const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);
  const toggleUrl = (type) => {
    setYearRangeValue(void 0);
    setMilesRangeValue(void 0);
    navigate();
  };
  useEffect(() => {
    const pathCondition = window.location.pathname.includes("new") ? "new" : "used";
    setCarCondition(pathCondition);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "m-2 flex", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-full rounded-l-lg border-y border-l py-2 ${carCondition === "new" ? "border-primary bg-primary text-white" : "bg-white text-black"}`,
        onClick: () => {
          setCarCondition("new");
          toggleUrl();
        },
        children: "New"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-full rounded-r-lg border-y border-r py-2 ${carCondition === "used" ? "border-primary bg-primary text-white" : "bg-white text-black"}`,
        onClick: () => {
          setCarCondition("used");
          toggleUrl();
        },
        children: "Used"
      }
    )
  ] });
}

function ModelFilter(props) {
  const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);
  const handleSelectionChange = useCallback(
    (item, checked) => {
      const checkedItems = props.items?.filter((e) => e.checked).map((e) => {
        return { name: e.value, parent: e.parent };
      }) ?? [];
      let updatedList = [...checkedItems];
      if (checked) {
        updatedList = [...checkedItems, { name: item.value, parent: item.parent }];
      } else {
        updatedList.splice(
          checkedItems.findIndex(
            (findingItem) => findingItem.name === item.value && findingItem.parent === item.parent
          ),
          1
        );
      }
      props.onChange(Array(...new Set(updatedList)));
      const updatedItems = props?.items?.map((prevItem) => {
        if (prevItem.value === item.value) {
          return { ...prevItem, checked };
        } else {
          return { ...prevItem };
        }
      });
      props.setItems && props.setItems(updatedItems);
    },
    [props.items, props.onChange, props.setItems]
  );
  const sortedItems = useMemo(() => {
    const uniqueValues = props.items?.reduce((acc, current) => {
      if (!acc.some((item) => item.value === current.value)) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueValues?.sort((a, b) => a.label.localeCompare(b.label));
  }, [props.items]);
  return /* @__PURE__ */ jsx(
    FilterWrapper,
    {
      title: props.title,
      className: `checklist-filter ${props.className}`,
      isExpanded: props.isExpanded,
      onExpandedChange: (value) => setFiltersVisible(value),
      children: /* @__PURE__ */ jsx(ScrollArea, { type: "always", children: !props.showItem ? /* @__PURE__ */ jsx("p", { children: props.message }) : /* @__PURE__ */ jsx("div", { className: `${filtersVisible ? "flex" : "hidden"}  max-h-48 min-h-8 flex-col`, children: sortedItems?.length > 0 ? sortedItems.map((item, index) => /* @__PURE__ */ jsx(
        Checkbox,
        {
          className: "my-1.5 w-11/12 cursor-pointer text-base leading-8 md:text-sm md:leading-5",
          labelClass: "text-black/85 truncate",
          label: item.label,
          value: item.value,
          checked: item.checked,
          onChange: (isChecked) => handleSelectionChange(item, isChecked)
        },
        item.label + index.toString()
      )) : `No ${props.title} to show` }) })
    }
  );
}

function SideBarFilters(props) {
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
  console.log(selectedFiltersState);
  const priceRange = useYogaCarStore((state) => state.priceRange);
  const priceRangeValue = useYogaCarStore((state) => state.priceRangeValue);
  const setPriceRangeValue = useYogaCarStore((state) => state.setPriceRangeValue);
  const milesRange = useYogaCarStore((state) => state.milesRange);
  const milesRangeValue = useYogaCarStore((state) => state.milesRangeValue);
  const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);
  const yearRange = useYogaCarStore((state) => state.yearRange);
  const yearRangeValue = useYogaCarStore((state) => state.yearRangeValue);
  const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
  const makeList = useYogaCarStore((state) => state.makeList);
  const setMakeList = useYogaCarStore((state) => state.setMakeList);
  const modelList = useYogaCarStore((state) => state.modelList);
  const setModelList = useYogaCarStore((state) => state.setModelList);
  const locationList = useYogaCarStore((state) => state.locationList);
  const setLocationList = useYogaCarStore((state) => state.setLocationList);
  useYogaCarStore((state) => state.trimList);
  useYogaCarStore((state) => state.setTrimList);
  const fuelTypeList = useYogaCarStore((state) => state.fuelTypeList);
  const setFuelTypeList = useYogaCarStore((state) => state.setFuelTypeList);
  const drivetrainList = useYogaCarStore((state) => state.drivetrainList);
  const setDrivetrainList = useYogaCarStore((state) => state.setDrivetrainList);
  const bodyTypeList = useYogaCarStore((state) => state.bodyTypeList);
  const setBodyTypeList = useYogaCarStore((state) => state.setBodyTypeList);
  useYogaCarStore((state) => state.exteriorColorList);
  useYogaCarStore((state) => state.setExteriorColorList);
  useYogaCarStore((state) => state.interiorColorList);
  useYogaCarStore((state) => state.setInteriorColorList);
  useYogaCarStore((state) => state.typeList);
  useYogaCarStore((state) => state.setTypeList);
  console.log("bodyTypeList");
  const updateOnChange = (state) => {
    props.onFilterChange(state);
  };
  const handlePriceFilterChange = (min, max) => {
    if (max === priceRange?.[1] && min === priceRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.price;
      updateOnChange(newState);
    } else {
      const newPriceState = { ...selectedFiltersState?.price };
      newPriceState.min = min;
      newPriceState.max = max;
      const newState = { ...selectedFiltersState, price: newPriceState };
      updateOnChange(newState);
      setPriceRangeValue([newPriceState.min, newPriceState.max]);
    }
  };
  const handleMakeSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.make = [...selection];
    const filterMakeModel = selection.flatMap((item) => {
      return selectedFiltersState?.model === void 0 ? [] : selectedFiltersState?.model?.filter((model) => model?.parent === item);
    })?.filter((model) => model !== void 0);
    newState.model = filterMakeModel;
    if (filterMakeModel.length > 0) {
      newState.model = [...filterMakeModel];
    } else {
      delete newState.model;
    }
    const filterModelTrim = filterMakeModel.flatMap((item) => {
      return selectedFiltersState?.trim === void 0 ? [] : selectedFiltersState?.trim?.filter((trim) => trim.parent === item.name);
    })?.filter((trim) => trim !== void 0);
    if (filterModelTrim.length > 0) {
      newState.trim = [...filterModelTrim];
    } else {
      delete newState.trim;
    }
    updateOnChange(newState);
  };
  const handleModelSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.model = [...selection];
    const filterModelTrim = selection.flatMap((item) => {
      return selectedFiltersState?.trim === void 0 ? [] : selectedFiltersState?.trim?.filter((trim) => trim.parent === item.name);
    })?.filter((trim) => trim !== void 0);
    newState.trim = filterModelTrim;
    updateOnChange(newState);
  };
  const handleYearFilterChange = (min, max) => {
    if (max === yearRange?.[1] && min === yearRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.year;
      updateOnChange(newState);
    } else {
      const newYearState = { ...selectedFiltersState?.year };
      newYearState.min = min;
      newYearState.max = max;
      const newState = { ...selectedFiltersState, year: newYearState };
      updateOnChange(newState);
      setYearRangeValue([newYearState.min, newYearState.max]);
    }
  };
  const handleLocationSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.location = [...selection];
    updateOnChange(newState);
  };
  const handleMilesFilterChange = (min, max) => {
    if (max === milesRange?.[1] && min === milesRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.miles;
      updateOnChange(newState);
    } else {
      const newMilesState = { ...selectedFiltersState?.miles };
      newMilesState.min = min;
      newMilesState.max = max;
      const newState = { ...selectedFiltersState, miles: newMilesState };
      updateOnChange(newState);
      setMilesRangeValue([newMilesState.min, newMilesState.max]);
    }
  };
  const handleFuelTypeSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.fuelType = [...selection];
    updateOnChange(newState);
  };
  const handleBodyTypeSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.bodyType = [...selection];
    updateOnChange(newState);
  };
  const handleDrivetrainSelection = (selection) => {
    const newState = { ...selectedFiltersState };
    newState.drivetrain = [...selection];
    updateOnChange(newState);
  };
  console.log(priceRangeValue);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: ` z-50 w-full rounded-xl bg-white  p-8 lg:rounded-none lg:bg-none lg:p-0 lg:shadow-none`,
      children: [
        /* @__PURE__ */ jsx(ConditionFilter, {}),
        /* @__PURE__ */ jsx(
          RangeFilter,
          {
            className: "border-y border-t-0 border-black/30  ",
            isExpanded: true,
            minRange: priceRange?.[0],
            maxRange: priceRange?.[1],
            minValue: priceRangeValue ? priceRangeValue[0] : void 0,
            maxValue: priceRangeValue ? priceRangeValue[1] : void 0,
            step: 1e3,
            title: "Price",
            minLabel: "Min Price",
            maxLabel: "Max Price",
            format: "currency",
            onChange: handlePriceFilterChange
          }
        ),
        /* @__PURE__ */ jsx(
          ChecklistFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            isExpanded: props.contextBodyType || selectedFiltersState?.bodyType?.length > 0 ? true : false,
            title: "Body Type",
            items: bodyTypeList,
            setItems: setBodyTypeList,
            onChange: handleBodyTypeSelection,
            showItem: true
          }
        ),
        /* @__PURE__ */ jsx(
          RangeFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            minRange: yearRange?.[0],
            maxRange: yearRange?.[1],
            minValue: yearRangeValue ? yearRangeValue[0] : void 0,
            maxValue: yearRangeValue ? yearRangeValue[1] : void 0,
            title: "Year",
            rangeSelectorLabel: "Model Years",
            minLabel: "Min Year",
            maxLabel: "Max Year",
            format: "year",
            onChange: handleYearFilterChange
          }
        ),
        /* @__PURE__ */ jsx(
          ChecklistFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            isExpanded: props.contextMake !== "*" || props.contextModel !== "*" || selectedFiltersState?.make?.length > 0 ? true : false,
            title: "Make",
            items: makeList,
            setItems: setMakeList,
            onChange: handleMakeSelection,
            showItem: true
          }
        ),
        /* @__PURE__ */ jsx(
          ModelFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            isExpanded: props.contextModel !== "*" || selectedFiltersState?.model?.length > 0 ? true : false,
            title: "Model",
            items: modelList,
            setItems: setModelList,
            onChange: handleModelSelection,
            message: "Please select a Make",
            showItem: selectedFiltersState?.make?.length > 0 || selectedFiltersState?.model?.length > 0 || props.contextMake && props.contextMake !== "*" || props.contextModel && props.contextModel !== "*" ? true : false
          }
        ),
        /* @__PURE__ */ jsx(
          RangeFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            minRange: milesRange?.[0],
            maxRange: milesRange?.[1],
            minValue: milesRangeValue ? milesRangeValue[0] : void 0,
            maxValue: milesRangeValue ? milesRangeValue[1] : void 0,
            title: "Mileage",
            rangeSelectorLabel: "Mileage Range",
            minLabel: "Min Miles",
            maxLabel: "Max Miles",
            format: "distance",
            onChange: handleMilesFilterChange
          }
        ),
        /* @__PURE__ */ jsx(
          ChecklistFilter,
          {
            className: "border-b border-black/30 ",
            title: "Drivetrain",
            items: drivetrainList,
            setItems: setDrivetrainList,
            onChange: handleDrivetrainSelection,
            showItem: true
          }
        ),
        /* @__PURE__ */ jsx(
          ChecklistFilter,
          {
            className: "border-y border-t-0 border-black/30 ",
            title: "Location",
            items: locationList,
            setItems: setLocationList,
            onChange: handleLocationSelection,
            showItem: true
          }
        ),
        /* @__PURE__ */ jsx(
          ChecklistFilter,
          {
            className: " border-black/30 ",
            title: "Fuel Type",
            items: fuelTypeList,
            setItems: setFuelTypeList,
            onChange: handleFuelTypeSelection,
            showItem: true
          }
        )
      ]
    }
  );
}

function CarPage({ initialData, initialFilters }) {
  const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
  const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
  useYogaCarStore((state) => state.applyingFilter);
  const handleFilterStateChangeAction = useYogaCarStore((state) => state.handleFilterStateChangeAction);
  const contextMake = "subaru";
  const setParamAction = useYogaCarStore((state) => state.setParamAction);
  useYogaCarStore((state) => state.readParam);
  const contextModel = "*";
  const [searchParam, setSearchParam] = useState();
  console.log(searchParam);
  const contextBodyType = useYogaCarStore((state) => state.contextBodyType);
  const [vehicles, setVehicles] = useState(initialData.vehicles);
  const [totalCount, setTotalCount] = useState(initialData.count);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadMore, setIsLoadMore] = useState(false);
  useEffect(() => {
    setIsLoadMore(() => false);
  }, [vehicles]);
  console.log(4444);
  const [showTrim, setShowTrim] = useState(false);
  const handleFilterStateChange = useCallback(
    useDebounce(async (state, take, skip, sortOption) => {
      console.log(33333333333333335e5);
      handleFilterStateChangeAction(
        contextMake,
        contextModel,
        initialData,
        state,
        take,
        skip,
        sortOption
      );
    }, 200),
    [contextMake, contextModel, initialData]
  );
  const setParam = useCallback(
    (data, sort, clearAll) => {
      console.log(11112222);
      if (searchParam) {
        setParamAction(
          searchParam,
          2e6,
          contextMake,
          contextModel,
          contextBodyType,
          handleFilterStateChange,
          data,
          sort,
          clearAll
        );
      }
    },
    [searchParam, setParamAction, contextMake, contextModel, handleFilterStateChange]
  );
  useEffect(() => {
    if (searchParam) {
      setParam();
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative mb-1 grid w-full grid-flow-col grid-cols-4 items-start justify-center pb-10 pr-0 xl:grid-cols-5 2xl:grid-cols-6 4xl:m-auto 4xl:max-w-screen-4xl", children: [
    /* @__PURE__ */ jsx("div", { className: "col-span-1 hidden lg:block", children: /* @__PURE__ */ jsx(
      SideBarFilters,
      {
        contextMake,
        contextModel,
        contextBodyType,
        handleFilterStateChange,
        setParam,
        showTrim,
        onFilterChange: (state) => {
          handleFilterStateChange(state);
          setSelectedFiltersState(state);
          setParam(state, selectedSortOption);
        }
      }
    ) }),
    /* @__PURE__ */ jsx("main", { className: "relative col-span-6 my-3 h-full w-full rounded-3xl bg-pure-gray-400 p-4 @container lg:col-span-3 lg:mb-10 lg:p-8 xl:col-span-4 xl:mt-0 2xl:col-span-5", children: /* @__PURE__ */ jsx(
      CarsListBlock,
      {
        BATCH_SIZE: 20,
        error,
        isFetching: isLoading,
        vehicleList: vehicles,
        isLoadMore
      }
    ) })
  ] });
}

const NavList = [
  { label: "Browse Vehicles", href: "/new-vehicles-quincy-ma/" },
  { label: "Sell/Trade ▼", href: "/sell-and-trade/" },
  { label: "Financing", href: "/car-loans-in-quincy-ma" },
  { label: "Schedule Service", href: "https://service.yogaplugin.com/" },
  { label: "Car Parts", href: "https://quirkcarparts.com/" },
  {
    label: "More ▼",
    href: "",
    subList: [
      { label: "FAQ", href: "/faq/" },
      { label: "About", href: "/about/" },
      { label: "Careers", href: "https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=FD8E2BBFB93430E1320C9B1A37535D27" },
      { label: "Shop Accessories", href: "https://quirkcarparts.com/accessories/index/" },
      { label: "Quirk Warranty", href: "/quirk-warranty/" },
      { label: "Commercial", href: "https://quirktrucks.worktrucksolutions.com/" },
      { label: "Our Dealership", href: "/about-quirk-cars-in-quincy-ma/" },
      { label: "Meet Daniel J. Quirk", href: "/meet-daniel-j-quirk/" },
      { label: "Blogs", href: "/blog/" }
    ]
  },
  { label: "Contact", href: "/contact/" }
];
const MobileNavList = [
  { label: "Browse Vehicles", href: "/new-vehicles-quincy-ma/" },
  { label: "Sell/Trade", href: "/sell-and-trade/" },
  { label: "Financing", href: "/car-loans-in-quincy-ma" },
  { label: "Schedule Service", href: "https://service.yogaplugin.com/" },
  { label: "Car Parts", href: "https://quirkcarparts.com/" },
  { label: "Shop Accessories", href: "https://quirkcarparts.com/accessories/index/" },
  { label: "FAQ", href: "/faq/" },
  { label: "About", href: "/about/" },
  { label: "Careers", href: "https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=FD8E2BBFB93430E1320C9B1A37535D27" },
  { label: "Quirk Warranty", href: "/quirk-warranty/" },
  { label: "Commercial", href: "https://quirktrucks.worktrucksolutions.com/" },
  { label: "Our Dealership", href: "/about-quirk-cars-in-quincy-ma/" },
  { label: "Meet Daniel J. Quirk", href: "/meet-daniel-j-quirk/" },
  { label: "Contact", href: "/contact/" },
  { label: "Blogs", href: "/blog/" }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-full", children: [
    /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex items-center gap-12 px-5", children: [
      /* @__PURE__ */ jsx("a", { href: "/", "aria-label": "yoga-cars", className: "mr-10 w-1/2 sm:w-fit lg:mr-20", children: /* @__PURE__ */ jsx("img", { src: "public/assets/images/svg/QuirkLogo.svg", alt: "Yoga Cars Logo", className: "h-10" }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden w-full items-center justify-between xl:flex", children: [
        /* @__PURE__ */ jsx(Listing, { NavData: NavList, sliceStart: 0, sliceEnd: 5 }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-12", children: /* @__PURE__ */ jsx(Listing, { NavData: NavList, sliceStart: 5 }) })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "ml-auto h-10 w-10 xl:hidden text-2xl", onClick: () => setOpen(!open), children: "☰" })
    ] }),
    open && /* @__PURE__ */ jsx("div", { className: "fixed right-0 top-0 z-50 h-screen w-full bg-gray-400 xl:hidden", children: /* @__PURE__ */ jsxs("div", { className: "w-full overflow-y-auto xl:hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 pt-5", children: [
        /* @__PURE__ */ jsx("a", { href: "/", "aria-label": "yoga-cars", className: "mr-10 w-1/2 sm:w-fit lg:mr-20", children: /* @__PURE__ */ jsx("img", { src: "public/assets/images/svg/QuirkLogo.svg", alt: "Yoga Cars Logo", className: "h-10" }) }),
        /* @__PURE__ */ jsx("button", { className: "ml-auto h-10 w-10 text-2xl", onClick: () => setOpen(!open), children: "✖" })
      ] }),
      /* @__PURE__ */ jsx(Listing, { setOpen, NavData: MobileNavList })
    ] }) })
  ] });
}
function Listing({ sliceStart, sliceEnd, setOpen, NavData }) {
  return /* @__PURE__ */ jsx("div", { className: "mt-10 flex flex-col gap-x-12 px-5 xl:mt-0 xl:flex-row xl:gap-y-5 xl:px-0", children: NavData.slice(sliceStart, sliceEnd).map((item, index) => /* @__PURE__ */ jsx("div", { className: "group relative", children: /* @__PURE__ */ jsxs("div", { className: `min-w-12 hover:text-primary`, children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: item.href,
        className: "flex py-1 pr-12 text-base xl:py-0 xl:pr-0 xl:text-base",
        onClick: () => item.href !== "" && setOpen && setOpen(false),
        children: item.label
      }
    ),
    item.subList && /* @__PURE__ */ jsx("div", { className: "absolute z-50 hidden w-44 animate-dropDownAnimation flex-col rounded-lg border bg-white p-2 drop-shadow-md group-hover:flex", children: item.subList.map((subItem, subIndex) => /* @__PURE__ */ jsx(
      "a",
      {
        className: "my-2 px-4 hover:text-primary",
        href: subItem.href,
        onClick: () => subItem.href !== "" && setOpen && setOpen(false),
        children: subItem.label
      },
      subIndex
    )) })
  ] }) }, index)) });
}

const $$DefaultLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Website</title>${renderHead()}</head> <body> <!-- Header Section --> <header class="header"> ${renderComponent($$result, "Navbar", Navbar, {})} <!-- This will render your Navbar component here --> </header> <!-- Main Content (Where the page-specific content will go) --> <main class="main-content"> ${renderSlot($$result, $$slots["default"])} <!-- This is where child components or pages are inserted --> </main> <!-- Footer Section --> <footer class="footer"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} My Website. All Rights Reserved.</p> </footer> </body></html>`;
}, "/home/alex/Projects/yogaCarsAstro/src/layouts/DefaultLayout.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const apiUrl = "http://localhost:4322/api/";
  const vehicleResponse = await fetch(apiUrl + "vehicles");
  const { vehicles, count } = await vehicleResponse.json();
  const filterResponse = await fetch(apiUrl + "fetchVehicleFilters");
  const { initialFilters } = await filterResponse.json();
  return renderTemplate`${renderComponent($$result, "DefaultLayout", $$DefaultLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div> ${renderComponent($$result2, "Branding", Branding, { "logosClassName": "fill-black", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/alex/Projects/yogaCarsAstro/src/components/Home/Branding", "client:component-export": "default" })} ${renderComponent($$result2, "CarPage", CarPage, { "client:load": true, "initialData": { vehicles, count }, "initialFilters": initialFilters, "client:component-hydration": "load", "client:component-path": "/home/alex/Projects/yogaCarsAstro/src/components/Car/CarPage", "client:component-export": "default" })} </div> ` })}`;
}, "/home/alex/Projects/yogaCarsAstro/src/pages/index.astro", void 0);
const $$file = "/home/alex/Projects/yogaCarsAstro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
