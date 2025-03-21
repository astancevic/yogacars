import React from 'react';
import LineBarIcon from '/assets/images/svg/line-bar-icon.svg?url';

function DifferentApproach() {
  return (
    <div className="mx-auto flex w-full  flex-col items-center justify-between py-2 text-left md:flex-row  md:px-10 lg:pb-12 lg:pl-10 lg:pr-20 lg:pt-8">
      <div className="basis-1/2">
        <span>
          <h2 className="px-6 pb-0 text-left text-3xl font-semibold md:px-0 md:pb-5 lg:text-[40px] lg:leading-10">
            Why choose Quirk?
            {/* We take a different approach */}
          </h2>


          <img src={LineBarIcon} alt="icon line bar"/>
        </span>
        <p className="mx-auto mt-3 w-5/6 text-justify text-base leading-7 md:mx-0 md:text-justify md:text-xl md:leading-10 3xl:w-2/3 ">
          Our commitment to our customers continues well beyond the date of purchase. We also have a
          professional team of technicians on hand with the skills and equipment to handle all
          manner of maintenance and repairs, as well as a full stock of authentic parts. Make your
          way to Quirk today for quality vehicles, a friendly team, and professional service at
          every step of the way.
        </p>
      </div>
      <div className="flex basis-1/2 justify-center">
        <img src="/public/assets/images/car-diff.png" alt="car-diff" />
      </div>
    </div>
  );
}

export default DifferentApproach;
