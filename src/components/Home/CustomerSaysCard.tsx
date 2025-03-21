import React from 'react';

function CustomerSaysCard({description}: {description: string}) {
  return (
    <div className="relative mx-2 my-4   text-justify md:mx-1 md:my-0">
      <div className="flex w-full flex-col items-start  rounded-md p-8  px-4   py-6   shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  md:px-6 lg:h-[350px] xl:h-60">
        <p className="text-center text-sm font-light  leading-7 md:text-base lg:leading-9">
          {description}
        </p>
      </div>
    </div>
  );
}

export default CustomerSaysCard;
