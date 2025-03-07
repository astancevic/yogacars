import React from 'react';
import type { StylableProp } from '@/util/StylableProps.ts';
import { formatNumber, useFormatCurrency } from './formatCurrency';

interface CarListCardProps {
  images?: string;
  heroImageUrl?: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  invoice: number | null;
  type: string | null;
  vin: string | null;
  miles: number | null;
  dealerCity: string | null;
  dealerState: string | null;
  onClick?: () => void;
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
                     }: StylableProp<CarListCardProps>) {
  const price = useFormatCurrency(invoice ?? 0);
  const aspectRatio = ' aspect-w-4 aspect-h-3';

  return (
      <a
          href={`/listing/${vin}`}
          className={`w-full max-w-md cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl ${className}`}
      >
        <div className={`${aspectRatio} bg-gray-100 flex items-end justify-center`}>
          {heroImageUrl ? (
              <img
                  src={heroImageUrl}
                  alt={`${year} ${make} ${model}`}
                  className="w-full h-full object-cover"
                  width={448}  // Ensure this matches your container's max width
                  height={336} // Maintain the 4:3 aspect ratio
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                  <span className="text-gray-400">No Image</span>
              </div>
          )}
        </div>

          <div className="rounded-b-2xl bg-white p-4">
          <div className="flex items-center justify-between whitespace-nowrap text-xs text-pure-gray/65 2xl:text-sm">
            <span>{type}</span>
            <span>{formatNumber(miles ?? 0, 0)} mi</span>
          </div>

          <div>
            <h2 className="mt-1 truncate text-base font-medium text-black 2xl:text-lg">
              {year} {make} {model}
            </h2>
            <span className="block w-11/12 truncate text-xs text-black/80 2xl:text-sm">
            {trim?.length ? trim : <>&nbsp;</>}
          </span>
          </div>

          <div className="flex items-center justify-between">
          <span className="text-xs text-pure-gray/65 2xl:text-xs">
            {dealerCity}, {dealerState}
          </span>
            <h2 className="text-right text-base font-semibold text-primary 2xl:text-lg">
              {price === '$0' ? 'Call' : price}
            </h2>
          </div>
        </div>
      </a>
  );
}

export default CarListCard;
