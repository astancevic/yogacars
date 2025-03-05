import React from 'react';
import PlaceholderBlock from '../CarLists/Cards/PlaceholderBlock';
import type {APIVehicle} from '@/lib/types.ts';
import CarListCard from '../CarLists/CarListCard';

interface CarsListBlockProps {
  error: Error | null;
  isFetching: boolean;
  isLoadMore: boolean;
  vehicleList: APIVehicle[];
  BATCH_SIZE: number;
}

export default function CarsListBlock({
  error,
  isFetching,
  isLoadMore,
  vehicleList,
  BATCH_SIZE
}: CarsListBlockProps) {
  // const { selectedView } = useFilterContext();
  const selectedView = 'grid';
  return (
    <div
      className={`${
        selectedView === 'grid'
          ? ' car-list-block grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  min-[2000px]:grid-cols-5 '
          : ' grid grid-cols-1 gap-4 lg:gap-6'
      } `}
    >
      {error ? (
        <div className="col-span-full text-center">
          <h2 className="text-3xl">Oops</h2>
          <p className="text-lg">We ran into an unexpected error and couldn't recover.</p>
          <p className="whitespace-pre font-mono text-red-600">{error.message}</p>
        </div>
      ) : isFetching && !isLoadMore ? (
        <PlaceholderBlock
          count={BATCH_SIZE}
          selectedView={selectedView === 'grid' ? 'grid' : 'list'}
        />
      ) : (
        <>
          {vehicleList.map((vehicle, index) => {
            return (
              <div key={index} className="w-full">
                  <>
                    <CarListCard
                      heroImageUrl="https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUS04_640/2024SUS040102_640_01.jpg"
                      key={vehicle.vin}
                      vin={vehicle.vin}
                      invoice={vehicle.sellingPrice}
                      year={vehicle.year}
                      type={vehicle.type}
                      miles={vehicle.mileage}
                      make={vehicle.make_name}
                      model={vehicle.model_name}
                      trim={vehicle.trim}
                      dealerCity={vehicle.dealerCity}
                      dealerState={vehicle.dealerState}
                      className="block"
                    />
                  </>
              </div>
            );
          })}
          {isLoadMore && (
            <PlaceholderBlock
              count={BATCH_SIZE}
              selectedView={selectedView === 'grid' ? 'grid' : 'list'}
            />
          )}
        </>
      )}
    </div>
  );
}
