import React, { memo } from 'react';
import { cn } from '@/lib/utils.ts';
import useWindowSize from '../../lib/hooks/useWindowSize';

interface BrandingProps {
    className?: string;
    logosClassName?: string;
}

const carsLogos = [
    { src: '/assets/images/svg/Chevrolet_logo.svg', name: 'Chevrolet', className: 'lg:block' },
    { src: '/assets/images/svg/KIA_logo.svg', name: 'Kia', className: 'lg:block' },
    { src: '/assets/images/svg/gmc.svg', name: 'GMC', className: 'lg:block' },
    { src: '/assets/images/svg/Ford_logo.svg', name: 'Ford', className: 'lg:block' },
    { src: '/assets/images/svg/Volkswagen_logo.svg', name: 'Volkswagen', className: 'lg:block' },
    { src: '/assets/images/svg/Hyundai_logo.svg', name: 'Hyundai', className: 'lg:block' },
    { src: '/assets/images/svg/Mazda_logo.svg', name: 'Mazda', className: 'lg:block' },
    { src: '/assets/images/svg/Jeep_logo.svg', name: 'Jeep', className: 'lg:block' },
    { src: '/assets/images/svg/subaru.svg', name: 'Subaru', className: 'lg:block' },
    { src: '/assets/images/svg/Nissan_logo.svg', name: 'Nissan', className: 'lg:block' },
    { src: '/assets/images/svg/buick.svg', name: 'Buick', className: 'lg:block' },
    { src: '/assets/images/svg/dodge.svg', name: 'Dodge', className: 'xl:block' },
    { src: '/assets/images/svg/genesis.svg', name: 'Genesis', className: '1xl:block' },
    { src: '/assets/images/svg/chrysler.svg', name: 'Chrysler', className: '3xl:block' },
    { src: '/assets/images/svg/ram.svg', name: 'Ram', className: '1xl:block' }
];

const Branding = memo(({ className, logosClassName }: BrandingProps) => {
    const [screenWidth] = useWindowSize();

    return (
        <div className={
            ' mx-auto  hidden h-14 w-fit  items-center justify-center  overflow-hidden px-2 lg:flex lg:gap-8 '
        }>
            {
                carsLogos.map((item, index) => (
                    <a
                        aria-label={`New ${item.name} in Quincy, MA`}
                        href={`/new-${item.name.toLowerCase()}-quincy-ma/`}
                        key={index}
                        className={`hidden cursor-pointer ${item.className}`}
                    >
                        <img src={item.src} alt={item.name} className={cn(`hidden cursor-pointer ${item.className}`, logosClassName)}/>
                    </a>
                ))}
        </div>
    );
});

export default Branding;
