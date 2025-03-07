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

  const testImages = [
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/cc_2024SUC04_01_640/cc_2024SUC040034_01_640_WH4.jpg",
      'https://content.homenetiol.com/2002458/2170692/0x0/stock_images/5/2024FOS09_640/2024FOS090011_640_01.jpg',
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/cc_2024SUC04_02_640/cc_2024SUC040021_02_640_WH4.jpg",
      'https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUS31_640/2024SUS310024_640_01.jpg',
      'https://content.homenetiol.com/2002458/2170779/0x0/stock_images/8/cc_2022KIC11_01_640/cc_2022KIC110012_01_640_KDG.jpg',
      'https://content.homenetiol.com/2002458/2170693/0x0/stock_images/8/cc_2024CHS09_01_640/cc_2024CHS090002_01_640_G1W.jpg',

    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/cc_2024SUC04_03_640/cc_2024SUC040021_03_640_WH4.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040015_640_01.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040017_640_02.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040018_640_03.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040019_640_05.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040020_640_06.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040021_640_07.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040022_640_11.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040023_640_12.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040024_640_13.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040025_640_18.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040026_640_24.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040034_640_25.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040035_640_28.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040036_640_43.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg",
    "https://content.homenetiol.com/2002458/2170705/0x0/stock_images/8/2024SUC04_640/2024SUC040037_640_44.jpg"
  ];
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
                      heroImageUrl={testImages[index]}
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
