import React, { memo } from 'react';
import { cn } from '@/lib/utils.ts';
import useWindowSize from '../../lib/hooks/useWindowSize';
import chevroletImage from '@/assets/images/svg/Chevrolet_logo.svg?url';
import kiaImage from '@/assets/images/svg/KIA_logo.svg?url';
import gmcImage from '@/assets/images/svg/gmc.svg?url';
import fordImage from '@/assets/images/svg/Ford_logo.svg?url';
import volkswagenImage from '@/assets/images/svg/Volkswagen_logo.svg?url';
import hyundaiImage from '@/assets/images/svg/Hyundai_logo.svg?url';
import mazdaImage from '@/assets/images/svg/Mazda_logo.svg?url';
import jeepImage from '@/assets/images/svg/Jeep_logo.svg?url';
import subaruImage from '@/assets/images/svg/subaru.svg?url';
import nissanImage from '@/assets/images/svg/Nissan_logo.svg?url';
import buickImage from '@/assets/images/svg/buick.svg?url';
import dodgeImage from '@/assets/images/svg/dodge.svg?url';
import genesisImage from '@/assets/images/svg/genesis.svg?url';
import chryslerImage from '@/assets/images/svg/chrysler.svg?url';
import ramImage from '@/assets/images/svg/ram.svg?url';

interface BrandingProps {
    className?: string;
    logosClassName?: string;
}

const carsLogos = [
    { src: chevroletImage, name: 'Chevrolet', className: 'lg:block' },
    { src: kiaImage, name: 'Kia', className: 'lg:block' },
    { src: gmcImage, name: 'GMC', className: 'lg:block' },
    { src: fordImage, name: 'Ford', className: 'lg:block' },
    { src: volkswagenImage, name: 'Volkswagen', className: 'lg:block' },
    { src: hyundaiImage, name: 'Hyundai', className: 'lg:block' },
    { src: mazdaImage, name: 'Mazda', className: 'lg:block' },
    { src: jeepImage, name: 'Jeep', className: 'lg:block' },
    { src: subaruImage, name: 'Subaru', className: 'lg:block' },
    { src: nissanImage, name: 'Nissan', className: 'lg:block' },
    { src: buickImage, name: 'Buick', className: 'lg:block' },
    { src: dodgeImage, name: 'Dodge', className: 'xl:block' },
    { src: genesisImage, name: 'Genesis', className: '1xl:block' },
    { src: chryslerImage, name: 'Chrysler', className: '3xl:block' },
    { src: ramImage, name: 'Ram', className: '1xl:block' }
];

const Branding = memo(({ className, logosClassName }: BrandingProps) => {
    const [screenWidth] = useWindowSize();

    return (
        <div className={
            'mx-auto h-14 w-full items-center justify-center overflow-hidden bg-black/40 lg:flex lg:gap-8'
        }>
            {
                carsLogos.map((item, index) => (
                    <a
                        aria-label={`New ${item.name} in Quincy, MA`}
                        href={`/new-${item.name.toLowerCase()}-quincy-ma/`}
                        key={index}
                        className={`hidden cursor-pointer ${item.className}`}
                    >
                        <img src={item.src} alt={item.name} className={cn(`hidden cursor-pointer ${item.className}`, logosClassName)} loading="lazy"/>
                    </a>
                ))}
        </div>
    );
});

export default Branding;
