import React from 'react';
import LineBarIcon from '@/assets/images/svg/line-bar-icon.svg?url';
import CustomerSaysCards from './CustomerSaysCards';
function CustomerSays() {
  return (
    <>
      <div className="mx-auto w-full md:px-10  lg:pl-10 lg:pr-20">
        <span>
          <h2 className="px-6  pb-0 text-left text-3xl font-semibold md:px-0 md:pb-5 lg:text-[40px]">
            What Our Customer Says
          </h2>
          <img src={LineBarIcon} className="hidden md:block" alt="line bar icon"/>

        </span>
      </div>
        <CustomerSaysCards/>
    </>
  );
}

export default CustomerSays;
