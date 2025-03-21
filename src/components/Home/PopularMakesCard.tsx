import React from 'react';
import { formatCurrency } from './formatCurrency';

interface CarListCardProps {
    heroImageUrl?: string;
    invoice?: number | null;
    year: number;
    make: string | null;
    model: string | null;
    trim: string | null;
    type: string;
    vin: string;
    miles: number;
    dealerCity: string | null;
    dealerState: string | null;
    className?: string;
}

function CarListCard({
                         heroImageUrl,
                         invoice,
                         year,
                         make,
                         model,
                         trim,
                         type,
                         vin,
                         miles,
                         dealerCity,
                         dealerState,
                         className = ''
                     }: CarListCardProps) {
    // Format location
    const location = dealerCity && dealerState ? `${dealerCity}, ${dealerState}` : '';

    // Format price - if invoice is null, show "Call for Price"
    const price = invoice ? formatCurrency(invoice) : 'Call for Price';

    // Determine URL for the car detail page
    const detailUrl = `/vehicle/${make?.toLowerCase()}-${model?.toLowerCase()}-${year}-${vin}`;

    return (

        <div className={`w-full overflow-hidden rounded-lg bg-white shadow-md ${className}`}>
            <a href={detailUrl}>
                <div className="relative h-48 overflow-hidden">
                    {heroImageUrl ? (
                        <img
                            src={heroImageUrl}
                            alt={`${year} ${make} ${model}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <span className="text-gray-400">No Image Available</span>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 bg-primary px-2 py-1 text-xs text-white">
                        {type}
                    </div>
                </div>
            </a>

            <div className="px-4 py-3">
                <a href={detailUrl} className="block hover:text-primary">
                    <h3 className="truncate text-lg font-semibold">
                        {year} {make} {model}
                    </h3>
                    {trim && <p className="mt-1 text-sm text-gray-600">{trim}</p>}
                </a>

                <div className="mt-3 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-600">{miles.toLocaleString()} miles</p>
                        <p className="text-xs text-gray-500">{location}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary">{price}</p>
                    </div>
                </div>

                <a
                    href={detailUrl}
                    className="mt-3 block w-full rounded bg-primary py-2 text-center text-sm font-medium text-white hover:bg-primary/80"
                >
                    View Details
                </a>
            </div>
        </div>
    );
}

export default CarListCard;