import React from 'react';
import LineBarIcon from '../../images/svg/line-bar-icon.svg';
import CustomerSaysCards from './CustomerSaysCards';
function CustomerSays() {
  return (
    <>
      <div className="mx-auto w-full md:px-10  lg:pl-10 lg:pr-20">
        <span>
          <h2 className="px-6  pb-0 text-left text-3xl font-semibold md:px-0 md:pb-5 lg:text-[40px]">
            What Our Customer Says
          </h2>
          <LineBarIcon className="hidden md:block"/>
            <img src='/public/assets/images/svg/QuirkLogo.svg' alt="Yoga Cars Logo" className="h-10"/>

        </span>
      </div>
        <CustomerSaysCards/>
    </>
  );
}

export default CustomerSays;
