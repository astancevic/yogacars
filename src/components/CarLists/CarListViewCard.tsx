// import { Link } from 'gatsby';
// import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
// import React from 'react';
// import { StylableProp } from '../../util/StylableProps';
// import { formatNumber, useFormatCurrency } from './formatCurrency';
// import { createVehicleDetailSlug } from '@/lib/utils';
//
// interface CarListViewCardProps {
//   image?: string;
//   heroImage?: IGatsbyImageData;
//   heroImageUrl?: string;
//   year: number | null;
//   make: string | null;
//   model: string | null;
//   invoice: number | null;
//   type: Queries.Type;
//   vin: string | null | undefined;
//   trim: string | null;
//   miles: number | null;
//   dealerCity: string | null | undefined;
//   dealerState: string | null | undefined;
//   onClick?: () => void;
// }
//
// function CarListViewCard({
//   heroImage,
//   heroImageUrl,
//   year,
//   make,
//   model,
//   invoice,
//   type,
//   vin,
//   miles,
//   trim,
//   dealerCity,
//   dealerState,
//   className,
//   onClick
// }: StylableProp<CarListViewCardProps>) {
//   const price = useFormatCurrency(invoice ?? 0);
//
//   const imageSize = `min-w-28 lg:min-w-32 lg:max-w-60 w-full rounded-xl`;
//
//   let imageNode = <></>;
//
//   if (heroImage) {
//     imageNode = (
//       /**
//        * Need this wrapper div here + h-full on GatsbyImage to work around a bug with
//        * GatsbyImage css style specificity and Tailwind Aspect Ratio plugin.
//        *
//        * Ref: https://github.com/gatsbyjs/gatsby/issues/34457
//        */
//       <div className="">
//         <GatsbyImage
//           className={`${imageSize}`}
//           image={heroImage}
//           alt={`${year} ${make} ${model}`}
//         />
//       </div>
//     );
//   } else if (heroImageUrl) {
//     imageNode = (
//       <div className="">
//         <img
//           className={` ${imageSize} object-cover`}
//           src={heroImageUrl}
//           alt={`${year} ${make} ${model}`}
//         />
//       </div>
//     );
//   }
//
//   return (
//     <Link
//       // to={`/listing/${vin}`}
//       to={createVehicleDetailSlug({
//         type,
//         year,
//         make: { name: make },
//         model: { name: model },
//         trim,
//         dealerCity,
//         dealerState,
//         vin
//       })}
//       className={`flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg transition-shadow hover:rounded-2xl hover:shadow-2xl lg:p-3 xl:max-h-52 ${className}`}
//     >
//       <div className={`h-full bg-gray-100 ${imageSize}`}>{imageNode}</div>
//
//       <div className="w-full rounded-b-2xl bg-white p-4 ">
//         <div className="flex items-center justify-between whitespace-nowrap text-xs text-pure-gray/65 sm:text-xs 2xl:text-sm">
//           <span>
//             {type} | #{vin}
//           </span>
//           <span>{formatNumber(miles ?? 0, 0)} mi</span>
//         </div>
//
//         <span>
//           <h2 className="mt-1 text-base font-medium text-black sm:text-lg lg:text-2xl 3xl:text-3xl">
//             {year} {make} {model}
//           </h2>
//
//           <span className="text-xs text-black/80 sm:text-sm lg:text-base 3xl:text-lg ">
//             {trim?.length ? trim : <>&nbsp;</>}
//           </span>
//         </span>
//
//         <span className="flex items-center justify-between">
//           <span className="sm:text-basis text-xs text-pure-gray/65 lg:text-xs 3xl:text-sm">
//             {dealerCity},{dealerState}
//           </span>
//           <h2 className="text-right text-base font-semibold text-primary sm:text-lg lg:text-2xl 3xl:text-3xl">
//             {price === '$0' ? 'Call' : price}
//           </h2>
//         </span>
//       </div>
//     </Link>
//   );
// }
//
// export default CarListViewCard;
