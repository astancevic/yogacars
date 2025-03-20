import React from 'react';
import RadiusIcon from '../../images/svg/customer-card-element.svg';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
interface CustomerProps {
  name: string;
  description: string;
  companyName: string;
  image: IGatsbyImageData;
  children?: JSX.Element;
}
function CustomerSaysCard({ name, companyName, description, image, children }: CustomerProps) {
  return (
    <div className="relative mx-2 my-4   text-justify md:mx-1 md:my-0">
      <div className="flex w-full flex-col items-start  rounded-md p-8  px-4   py-6   shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  md:px-6 lg:h-[350px] xl:h-60">
        <p className="text-center text-sm font-light  leading-7 md:text-base lg:leading-9">
          {description}
        </p>
      </div>
      {/* <div className="flex">
        <RadiusIcon />
        <span className="absolute bottom-11 left-9 lg:left-12 lg:top-[75%]">
          <GatsbyImage
            alt="customer-image"
            image={image}
            class="h-14 w-14 rounded-full bg-[#C8C8C8] lg:h-20 lg:w-20"
          />
        </span>
        <span className=" pl-3 pt-2 lg:pl-10 lg:pt-6 ">
          <h3 className="text-base font-semibold lg:text-xl">{name}</h3>
          <p className="text-sm font-normal text-[#777D8D] md:text-base">{companyName}</p>
        </span>
      </div> */}
    </div>
  );
}

export default CustomerSaysCard;
