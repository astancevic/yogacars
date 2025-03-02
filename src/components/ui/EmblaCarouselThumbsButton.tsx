import useWindowSize from '../../lib/hooks/useWindowSize';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Dot } from 'lucide-react';
import React from 'react';

type PropType = {
  selected: boolean;
  // isHovering: boolean;
  imgSrc?: string;
  heroImage?: IGatsbyImageData;
  heroImageAlt: string;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, index, onClick } = props;

  const [width] = useWindowSize();

  return (
    <div
      className={`flex flex-[0_0_1%] pl-0 lg:flex-[0_0_20%] lg:pl-2 ${selected && 'opacity-100'}`}
    >
      <button
        onClick={onClick}
        aria-label="slider thumbnails button"
        className={`m-0 block cursor-pointer touch-manipulation appearance-none rounded-lg border-0 bg-transparent  p-0 transition-opacity  duration-200 lg:w-full ${selected ? 'opacity-100' : 'opacity-20'}`}
        type="button"
      >
        <p className="hidden">button</p>
        <Dot
          className={`block scale-[2.0] cursor-pointer lg:hidden ${selected ? 'fill-primary text-primary' : 'fill-[#D9D9D9]'}`}
        />
        {width > 1023 && props.heroImage && (
          <GatsbyImage
            image={props.heroImage}
            alt={props.heroImageAlt}
            className=" hidden w-32 rounded-lg bg-gray-200 object-fill lg:block"
          />
        )}
        {width > 1023 && props.imgSrc && (
          <img
            className=" hidden w-32 rounded-lg bg-gray-200 object-fill lg:block"
            src={imgSrc}
            alt={props.heroImageAlt}
            loading="lazy"
          />
        )}
      </button>
    </div>
  );
};
