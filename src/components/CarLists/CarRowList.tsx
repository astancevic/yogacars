import React, { useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import CarListsRowSingleCard from './CarListsRowSingleCard';
import { Link } from 'gatsby';

interface CarRowListProps {
  showMoreCars: number;
  setAllData: any;
  filterArrData: any;
  /* setAllData: any;
  setMinMaxSellingPrice: any;
  minMaxSellingPrice: { min: number; max: number }; */
}
const rowListsImageQuery = graphql`
  query RowListsImage {
    file(relativePath: { eq: "car-row.png" }) {
      childImageSharp {
        fluid {
          src
        }
      }
    }
  }
`;
function CarRowList({ showMoreCars, setAllData, filterArrData }: CarRowListProps) {
  // const {
  //   file: {
  //     childImageSharp: {
  //       fluid: { src }
  //     }
  //   }
  // } = useStaticQuery(rowListsImageQuery);
  // const result = useStaticQuery<BasicListingQuery>(carListsQuery);
  // const arrData = result.allInventory.edges;

  const carOption = filterArrData?.slice(0, showMoreCars ?? 16);
  useEffect(() => {
    setAllData(carOption);
  }, [showMoreCars]);
  return (
    <div className="mx-auto flex w-[95%]  flex-col sm:mx-0 sm:w-full">
      {carOption.map(({ node }: any) => (
        <Link to={`/listing/${node.vin}`} key={node.vin}>
          <CarListsRowSingleCard
            title={`${node.make} ${node.model} ${node.doors}-doors ${node.body} ${node.exteriorColor}`}
            description="Bluetooth, Cooled seats, Keyless start, Leather seats"
            path="245,000 miles  >  Manual  >  Diesel"
            location={`${node.dealerCity}, ${node.dealerState}, USA`}
            price={node.sellingPrice}
            year={node.year}
            carImage={node.imageList}
          />
        </Link>
      ))}
    </div>
  );
}

export default CarRowList;
