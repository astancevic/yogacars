import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Thumb } from './EmblaCarouselThumbsButton';

type PropType = {
  // slides: number[];
  options?: EmblaOptionsType;
  heroImage?: IGatsbyImageData;
  heroImageAlt: string;
  imageUrls: string[];
};

const CarouselWithThumbnails: React.FC<PropType> = (props) => {
  const [isHovering, setIsHovering] = useState(props.heroImage ? true : true);
  const [imageError, setImageError] = useState<{ id: number; error: boolean }[]>();
  const [slides, setSlides] = useState<string[]>();
  // const slides = isHovering ? [...props.imageUrls] : [...props.imageUrls.slice(0, 5)];
  const options = props.options;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    loop: true
  });

  // console.log(props.imageUrls.length);
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const imageByIndex = (index: number): string | undefined => slides?.[index % slides.length];

  useEffect(() => {
    isHovering ? setSlides([...props.imageUrls]) : setSlides([...props.imageUrls.slice(0, 5)]);
  }, [isHovering]);

  // console.log(props.heroImage);
  // console.log(imageError?.[1].error);

  return (
    <div
      className="h-full w-full lg:p-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseDown={() => setIsHovering(true)}
      // onTouchStart={() => setIsHovering(true)}
      // onTouchStartCapture={() => setIsHovering(true)}
    >
      <div className="relative overflow-hidden" ref={emblaMainRef}>
        <div className="flex touch-pan-y">
          {props.heroImage ? (
            <div className="relative flex max-h-[800px] w-full min-w-0 flex-[0_0_100%] items-center justify-center rounded-2xl">
              {imageError?.[1].error ? (
                <div className="aspect-h-3 aspect-w-4 max-h-[800px] max-w-[600px] rounded-2xl bg-gray-200"></div>
              ) : (
                <GatsbyImage
                  image={props.heroImage}
                  alt={props.heroImageAlt}
                  className="aspect-h-3 aspect-w-4 max-h-[800px] w-full rounded-2xl object-cover"
                  loading="eager"
                  // onError={() => setImageError([...imageError!, { id: 0, error: true }])}
                />
              )}
            </div>
          ) : (
            <div className="aspect-h-3 aspect-w-4 max-h-[800px] rounded-2xl bg-gray-200"></div>
          )}
          {isHovering &&
            slides?.map((slide, index) => (
              <div
                className="relative flex min-w-0 flex-[0_0_100%] items-center justify-center rounded-2xl "
                key={index}
              >
                {/* {console.log(index)} */}
                {imageError?.filter((item) => item.id === index) ? (
                  <div className="aspect-h-3 aspect-w-4 max-h-[800px] rounded-2xl bg-gray-200"></div>
                ) : (
                  <img
                    className={`mx-auto my-auto  max-h-[800px] rounded-2xl object-cover ${
                      imageError ? 'hidden' : 'block'
                    }`}
                    src={imageByIndex(index)}
                    alt={props.heroImageAlt}
                    loading="lazy"
                    onError={() => setImageError([...imageError!, { id: index, error: true }])}
                  />
                )}
              </div>
            ))}
        </div>
        <div
          className="absolute left-4 top-1/2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#828079]/50 lg:left-10 lg:h-10 lg:w-10"
          onClick={() => emblaMainApi?.scrollPrev()}
        >
          <ArrowLeft className="h-3 text-white lg:h-8" />
        </div>
        <div
          className="absolute right-4 top-1/2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#828079]/50 lg:right-10 lg:h-10 lg:w-10"
          onClick={() => emblaMainApi?.scrollNext()}
        >
          <ArrowRight className="h-3 text-white lg:h-8" />
        </div>
      </div>

      <div className="mx-auto mt-3 h-fit w-1/2 space-x-0 lg:h-24 lg:w-3/4 lg:space-x-1">
        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex flex-row space-x-0 lg:space-x-1">
            {props.heroImage && (
              <Thumb
                onClick={() => onThumbClick(0)}
                selected={0 === selectedIndex}
                index={0}
                // imgSrc={imageByIndex(0)!}
                heroImage={props.heroImage}
                heroImageAlt={props.heroImageAlt}
                key={0}
              />
            )}
            {slides?.map((slide, index) => (
              <Thumb
                onClick={() => {
                  props.heroImage ? onThumbClick(index + 1) : onThumbClick(index);
                }}
                selected={props.heroImage ? index + 1 === selectedIndex : index === selectedIndex}
                index={props.heroImage ? index + 1 : index}
                imgSrc={imageByIndex(index)!}
                heroImageAlt={props.heroImageAlt}
                key={props.heroImage ? index + 1 : index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselWithThumbnails;
