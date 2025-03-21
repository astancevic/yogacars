import React from 'react';
import WrokersIcon from '/public/assets/images/svg/workers-icon.svg?url';
import FullDayServicesIcon from '/public/assets/images/svg/full-services-icon.svg?url';
import FastCarsIcon from '/public/assets/images/svg/fast-car-icon.svg?url';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import useWindowSize from '../../lib/hooks/useWindowSize';

const cardsData = [
  {
    iconSrc: WrokersIcon,
    heading: 'QUIRK WORKS for You!',
    text: 'Our team is here to help with all your automotive needs. Stop by and see our award-winning team at any of our convenient locations today.'
  },
  {
    iconSrc: FastCarsIcon,
    heading: 'Excellent selection',
    text: 'Choose from an exceptional selection of new, used and certified pre-owned cars, trucks and SUVs for every budget and style'
  },
  {
    iconSrc: FullDayServicesIcon,
    heading: 'Service Center',
    text: 'We strive to maintain our service to the highest of quality, completed in a timely manner with absolute professionalism.'
  }
];

function ProvideServices() {
  const [width] = useWindowSize();

  return (
      <div className="relative mx-auto w-full text-justify md:px-10 md:text-left">
        <div className="flex w-full flex-col items-start justify-between lg:flex-row 3xl:items-center">
          <img
              alt={'car-img'}
              src="/public/assets/images/provide-sec.png"
              className="mb-9 ml-5 mr-7 h-[418px] rounded-[50px] lg:mb-0 lg:h-[850px] lg:w-1/2"
          />

          <div className="w-full lg:right-10 lg:w-2/5">
            <h2 className="px-6 text-left text-3xl font-semibold not-italic md:px-0 md:leading-8 lg:text-[40px] lg:leading-10">
              Your Dealership Group in Quincy, MA
            </h2>
            <p className="mx-auto w-10/12 pt-4 text-sm font-normal leading-7 md:mx-0 md:w-full md:pt-8 md:text-xl md:leading-9">
              Expect the very best at Quirk! We take customer service seriously and go above and
              beyond to provide you with an exceptional shopping experience. We have several
              state-of-the-art dealerships in New Hampshire and Massachusetts that represent many
              popular automotive brands, including Chevrolet, Chrysler, Dodge, Ford, Jeep, Kia, Mazda,
              Nissan, RAM, Buick, GMC, Subaru and Volkswagen.
            </p>

            {width >= 1024 ? (
                <div className="mt-10 hidden lg:block">
                  <Carousel
                      className=""
                      opts={{
                        align: 'start'
                      }}
                  >
                    <CarouselContent className="mx-1 gap-x-5 p-5">
                      {cardsData.map((item, index) => {
                        return (
                            <CarouselItem
                                key={index}
                                className={`my-7 flex h-[300px] flex-col items-center justify-evenly rounded-2xl px-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] md:mx-2 md:h-[337px] lg:mx-0 lg:my-0 lg:w-64 xl:basis-1/2 ${
                                    item.heading === 'Excellent selection'
                                        ? 'bg-primary text-white'
                                        : 'bg-white'
                                }`}
                            >
                              <img src={item.iconSrc} alt={item.heading} />
                              <h3 className="text-base font-medium lg:text-xl">{item.heading}</h3>
                              <p className="w-[214px] text-center text-sm leading-7 lg:text-base">
                                {item.text}
                              </p>
                            </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <div className="mt-5 flex items-center justify-center gap-5">
                      <CarouselPrevious className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                      <CarouselNext className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                    </div>
                  </Carousel>
                </div>
            ) : null}
          </div>
        </div>

        {width < 1024 ? (
            <div className="block lg:hidden">
              <Carousel
                  className="w-full"
                  opts={{
                    align: 'start'
                  }}
              >
                <CarouselContent className="ml-0 gap-x-5">
                  {cardsData.map((item, index) => {
                    return (
                        <CarouselItem key={index} className={`my-5 pl-0`}>
                          <div
                              className={`mx-auto flex h-[300px] w-11/12 flex-col items-center justify-evenly rounded-2xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] md:h-[337px] 
                  ${item.heading === 'Excellent selection' ? 'bg-primary text-white' : 'bg-white'}`}
                          >
                            <img src={item.iconSrc} alt={item.heading} />
                            <h3 className="text-base font-medium lg:text-xl">{item.heading}</h3>
                            <p className="w-4/5 text-center text-sm leading-7 lg:text-base">
                              {item.text}
                            </p>
                          </div>
                        </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="mt-5 flex items-center justify-center gap-5">
                  <CarouselPrevious className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                  <CarouselNext className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
                </div>
              </Carousel>
            </div>
        ) : null}
      </div>
  );
}

export default ProvideServices;