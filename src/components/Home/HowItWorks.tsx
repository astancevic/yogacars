import React from 'react';
import LineBarIcon from '/assets/images/svg/line-bar-icon.svg?url';

const data = [
  {
    heading: 'New and Used Cars',
    description:
      'Shop over 5,000 vehicles in our inventory. In addition to our incredible vehicle inventory, we also offer automotive repair, service and OEM accessories.'
  },
  {
    heading: 'Sell or Trade',
    description:
      'Enter your Year, Make, Model and Trim and our system will give you instant price range.'
  },
  {
    heading: 'Buy Parts and Accessories online',
    description:
      'Shop OEM Parts and OEM Accessories on our website and get them delivered to your door.'
  }
];


function HowItWorks() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-between text-justify md:flex-row md:items-center md:px-10 lg:pl-10 lg:pr-20">
      <div className="w-full pt-0 md:w-1/2 md:pt-10">
        <h2 className="px-6 pb-0 text-left text-3xl font-semibold md:px-0 md:pb-5 lg:text-[40px]">
          QUIRK WORKS for You!
        </h2>
        <img src={LineBarIcon} alt="LineBarIcon" className="hidden md:block" />
        <div className=" mx-auto mt-10 w-10/12 md:mx-0 md:w-full">
          {data.map((item, index) => (
            <div key={index} className="my-4 lg:my-10">
              <div className="flex items-center gap-3 ">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-center  text-white">
                  {index + 1}
                </div>
                <p className="inline  text-base font-semibold md:text-xl 3xl:text-2xl">
                  {item.heading}
                </p>
              </div>
              <p className="w-full py-1 pl-9 text-sm  md:text-base 3xl:text-xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center md:w-1/2 ">
        <img src="/assets/images/car-how-it-works-2.png" alt="car-img" className="w-1/2 4xl:w-1/3" />
      </div>
    </div>
  );
}
export default HowItWorks;
