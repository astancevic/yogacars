import React from 'react';
import CarListCard from '../CarLists/CarListCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';

// Define types to replace Gatsby types
interface Vehicle {
    vin: string | number;
    body?: string;
    dateInStock?: string;
    invoice?: number | null;
    year: number;
    type: string;
    miles: number;
    dealerState: string;
    dealerCity: string;
    trim: string;
    heroImageUrl: string;
    make?: {
        name: string;
    };
    model?: {
        name: string;
    };
}

interface Model {
    id: number;
    name: string;
    vehicles: Vehicle[];
}

interface CardsProps {
    modelsList: Model[];
}

function PopularMakesCards({ modelsList }: CardsProps) {
    console.log("Models list received:", modelsList);

    // Handle the hero image URL - it appears to be a comma-separated list
    const getFirstImageUrl = (imageUrls: string) => {
        if (!imageUrls) return '';
        return imageUrls.split(',')[0];
    };

    return (
        <div className="mb-5 px-0 @container md:mb-16 md:px-10 ">
            <Carousel
                className="bg-transparent"
                opts={{
                    align: 'start'
                }}
            >
                <CarouselContent className="ml-0">
                    {modelsList && modelsList.length > 0 ? (
                        modelsList.flatMap(model =>
                            model.vehicles && model.vehicles.length > 0 ? (
                                model.vehicles.map((vehicle, index) => {
                                    // Extract the first image URL from the comma-separated list
                                    const imageUrl = getFirstImageUrl(vehicle.heroImageUrl || '');

                                    return (
                                        <CarouselItem
                                            key={`${model.id}-${index}`}
                                            className="mx-auto my-4 flex items-center justify-center px-3 md:basis-1/2 lg:my-8 lg:mb-12 lg:basis-1/3 xl:basis-1/4 3xl:basis-1/5 4xl:basis-1/6"
                                        >
                                            <CarListCard
                                                heroImageUrl={imageUrl}
                                                invoice={vehicle.invoice}
                                                year={vehicle.year || 0}
                                                make={vehicle.make?.name || null}
                                                model={vehicle.model?.name || null}
                                                trim={vehicle.trim || null}
                                                type={vehicle.type || null}
                                                vin={String(vehicle.vin || '')}
                                                miles={vehicle.miles || 0}
                                                dealerCity={vehicle.dealerCity || null}
                                                dealerState={vehicle.dealerState || null}
                                            />
                                        </CarouselItem>
                                    );
                                })
                            ) : []
                        )
                    ) : (
                        <CarouselItem className="w-full py-10 text-center">
                            <div className="rounded-lg border p-8 text-gray-500">
                                No vehicles available for this make
                            </div>
                        </CarouselItem>
                    )}
                </CarouselContent>

                <div className="mt-5 flex items-center justify-center gap-5">
                    <CarouselPrevious className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                    <CarouselNext className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                </div>
            </Carousel>
        </div>
    );
}

export default PopularMakesCards;