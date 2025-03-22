import React from 'react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const BODY_TYPES = ['Convertible', 'Coupe', 'Hatchback', 'SUV', 'Sedan', 'Truck'] as const;
type BodyType = (typeof BODY_TYPES)[number];

interface BodyTypeButtonProps {
  type: BodyType;
  image: any;
}

export default function BodyTypeSelector({bodyTypeImages}) {

  return (
      <ScrollArea
          type="always"
          className="mx-auto w-screen rounded bg-white px-5 py-3 drop-shadow-md lg:w-3/4 lg:max-w-screen-lg lg:px-10 lg:py-6"
      >
        <div className="flex items-center justify-between gap-3">
          {BODY_TYPES.map((type) => (

              <BodyTypeButton
                  key={type}
                  type={type}
                  image={bodyTypeImages[type]}
              />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
  );
}

function BodyTypeButton({ type, image, ...props }: BodyTypeButtonProps) {
    console.log(image)
  return (
      <a
          href={`/new-${type.toLowerCase()}-quincy-ma/`}
          className="group relative w-32 cursor-pointer pb-6"
      >
        <img
            src={image}
            alt={`${type} car`}
            className="z-50 w-full"
            loading="lazy"
            width="200"
            height="120"
        />
        <div
            className={`px:4 absolute bottom-0 left-0 right-0 top-0 flex h-full w-full cursor-pointer flex-col items-center pt-5 active:opacity-100 group-hover:opacity-60 md:px-0 lg:pt-0`}
        >
          <div
              className={`flex h-14 w-14 items-center justify-center rounded-lg border border-solid border-gray-800 group-hover:border-primary sm:h-16 sm:w-16 lg:h-20 lg:w-20`}
          ></div>
        </div>
        <span
            className={`block select-none pt-2 text-center text-sm text-[#1e1e1e] group-hover:text-[#00B543] sm:text-base`}
        >
        {type}
      </span>
      </a>
  );
}