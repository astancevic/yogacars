// import { graphql, useStaticQuery } from 'gatsby';
// import React, { useState } from 'react';
// import palceImg from '../../images/bg-image.png';
// import FavoriteIcon from '../../images/svg/favorite.svg';
// import { cardHoverShadow } from '../../lib/effects/Effects';
// import { useFormatCurrency } from './formatCurrency';
//
// interface RowCardProps {
//   title: string | null;
//   description: string | null;
//   path: string | null;
//   location: string | null;
//   price: number | null;
//   year: string | null;
//   carImage: string;
// }
//
// const rowListsBgImageQuery = graphql`
//   query RowListsBgImage {
//     file(relativePath: { eq: "car-bg-row.png" }) {
//       childImageSharp {
//         fluid {
//           src
//         }
//       }
//     }
//   }
// `;
// function CarListsRowSingleCard({
//   carImage,
//   title,
//   description,
//   path,
//   location,
//   price,
//   year
// }: RowCardProps) {
//   const {
//     file: {
//       childImageSharp: {
//         fluid: { src }
//       }
//     }
//   } = useStaticQuery(rowListsBgImageQuery);
//   const imageList = carImage.split(',');
//
//   const [isLoading, setIsLoading] = useState(true);
//
//   function onLoad() {
//     setTimeout(() => setIsLoading(false), 1000);
//   }
//
//   return (
//     <div
//       className={`${cardHoverShadow} mb-5 flex justify-between  rounded-[9px] border-[1px] border-solid border-[#1e1e1e3d] bg-white p-3 md:w-full`}
//     >
//       <span className="flex w-full flex-col items-start sm:flex-row sm:items-center">
//         <div className="relative w-10/12 md:w-1/3">
//           {/*   <img src={src} alt="..." /> */}
//           <img
//             src={palceImg}
//             style={{ display: isLoading ? 'block' : 'none' }}
//             alt="..."
//             className=" rounded-xl object-contain sm:left-0"
//           />
//           <img
//             src={imageList[0]}
//             onLoad={onLoad}
//             style={{ display: isLoading ? 'none' : 'block' }}
//             alt="..."
//             className=" rounded-xl object-contain sm:left-0"
//           />
//         </div>
//         <div className="flex w-full flex-col justify-between pt-3 sm:pl-5   md:pt-0">
//           <h2 className="text-xs font-medium leading-6 sm:text-xl ">{title}</h2>
//           <p className="text-xs leading-7 text-[#0000008c] sm:text-base ">{description}</p>
//           <p className="text-xs leading-7 text-[#0000008c] sm:text-base">{path}</p>
//           <span className="text-xs leading-7 text-[#00B543] sm:text-base">
//             Location: <p className="inline text-[#000000]">{location}</p>
//           </span>
//         </div>
//       </span>
//       <div className="flex flex-col items-end pl-1 sm:justify-between sm:pl-0">
//         <p className="w-[50px] bg-[#00B543] text-center text-xs leading-7 text-white">{year}</p>
//         <p className="text-xl font-bold leading-10 md:text-[32px]">{useFormatCurrency(price!)}</p>
//         <FavoriteIcon />
//       </div>
//     </div>
//   );
// }
//
// export default CarListsRowSingleCard;
