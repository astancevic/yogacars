import * as React from 'react';
import useEmblaCarousel, {
  type EmblaCarouselType as CarouselApi,
  type EmblaOptionsType as CarouselOptions,
  type EmblaPluginType as CarouselPlugin
} from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

// const [mainApi, setMainApi] = React.useState<CarouselApi>();

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y'
    },
    plugins
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
          className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute  h-8 w-8 rounded-full',
          // orientation === 'horizontal'
          //   ? '-left-12 top-1/2 -translate-y-1/2'
          //   : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4 text-white" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          // orientation === "horizontal"
          //   ? "-right-12 top-1/2 -translate-y-1/2"
          //   : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4 text-white" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

// const CarousalThumbnails = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   (...props) => {
//     // const [carouselThumbsRef, carouselThumbsApi] = useEmblaCarousel({
//     //   containScroll: 'keepSnaps',
//     //   dragFree: true
//     // });

//     const [selectedIndex, setSelectedIndex] = React.useState(0);
//     // const [emblaMainRef, emblaMainApi] = useEmblaCarousel(mainApi);
//     const emblaMainApi = mainApi;
//     const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
//       containScroll: 'keepSnaps',
//       dragFree: true
//     });

//     const onThumbClick = React.useCallback(
//       (index: number) => {
//         if (!emblaMainApi || !emblaThumbsApi) return;
//         emblaMainApi.scrollTo(index);
//       },
//       [emblaMainApi, emblaThumbsApi]
//     );

//     const onSelect = React.useCallback(() => {
//       if (!emblaMainApi || !emblaThumbsApi) return;
//       setSelectedIndex(emblaMainApi.selectedScrollSnap());
//       emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
//     }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

//     React.useEffect(() => {
//       if (!emblaMainApi) return;
//       onSelect();
//       emblaMainApi.on('select', onSelect);
//       emblaMainApi.on('reInit', onSelect);
//     }, [emblaMainApi, onSelect]);

//     return (
//       <div className="embla-thumbs">
//         <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
//           <div className="embla-thumbs__container">
//             {[1, 2, 3, 4, 5].map((data, index) => (
//               <div
//                 className={'embla-thumbs__slide'.concat(
//                   index === selectedIndex ? ' embla-thumbs__slide--selected' : ''
//                 )}
//               >
//                 <button
//                   onClick={() => onThumbClick(index)}
//                   className="embla-thumbs__slide__button"
//                   type="button"
//                 >
//                   <div className="embla-thumbs__slide__number bg-red-400">
//                     <span>{index + 1}</span>
//                   </div>
//                   {index + data}
//                   {/* <img className="embla-thumbs__slide__img" src={imgSrc} alt="Your alt text" /> */}
//                 </button>
//               </div>
//             ))}
//             {/* <CarouselItem></CarouselItem> */}
//             {/* {slides.map((index) => (
//               // <Thumb
//               //   onClick={() => onThumbClick(index)}
//               //   selected={index === selectedIndex}
//               //   index={index}
//               //   imgSrc={imageByIndex(index)}
//               //   key={index}
//               // />
//             ))} */}
//           </div>
//         </div>
//       </div>
//     );
//   }
// );
// CarousalThumbnails.displayName = 'CarouselThumbnails';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
  // CarousalThumbnails
};
