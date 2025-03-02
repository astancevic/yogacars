// src/components/Car/CarPage.tsx

import React, {useCallback, useEffect, useState} from 'react';
import type {APIVehicle} from '../../lib/types';
import CarsListBlock from "./CarsListBlock.tsx";
import {useYogaCarStore} from "@/store/yogaCarStore.ts";
import {useLocation} from "react-router";
import type {BaseSelectOption} from "@/components/FormControls/Dropdown.tsx";
import type {FilterState} from "@/components/Car/SideBarFilters.tsx";


type InitialData = {
    vehicles: APIVehicle[];
    count: number;
};

interface CarPageProps {
   initialData: InitialData;
}

// const CarPage: React.FC<CarPageProps> = ({ initialData }) => {
//     const { vehicles, aggregateVehicle } = initialData;
//
//     return (
//         <div >
//             <h1>Total Vehicles: {aggregateVehicle._count._all}</h1>
//             <div className="car-list">
//                 {vehicles.map((vehicle) => (
//                     <div key={vehicle.vin}>
//                         img
//                         <h2>{vehicle.make_name} {vehicle.model_name}</h2>
//                         <p>{vehicle.year} | {vehicle.type} | {vehicle.miles} miles</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//
//
//
//
//
//     );
// };




export default function CarPage({

                                    initialData,
                                }: CarPageProps) {
    console.log(initialData?.vehicles.vehicles);
    const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
    const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);

    // const priceRange = useYogaCarStore((state) => state.priceRange);
    // const milesRange = useYogaCarStore((state) => state.milesRange);
    // const yearRange = useYogaCarStore((state) => state.yearRange);

    const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
    const readParam = useYogaCarStore((state) => state.readParam);
    const carCondition = useYogaCarStore((state) => state.carCondition);
    const trimList = useYogaCarStore((state) => state.trimList);
    const setParamAction = useYogaCarStore((state) => state.setParamAction);
    const handleFilterStateChangeAction = useYogaCarStore(
        (state) => state.handleFilterStateChangeAction
    );

    // const [prevTrimList, setPrevTrimList] = useState<(string | null)[]>(
    //   queryResult.trim.distinct as string[]
    // );
    const [showTrim, setShowTrim] = useState(() => {
        if (contextMake !== '*' || contextModel !== '*') {
            return true;
        } else {
            return false;
        }
    });
    const [isLoadMore, setIsLoadMore] = useState(false);

    const locationPath = useLocation();
    const [searchParam, setSearchParam] = useState(new URLSearchParams(locationPath.search));
    // const searchParam = new URLSearchParams(locationPath.search);

    // useEffect(() => {
    //   setSearchParam(new URLSearchParams(locationPath.search));
    //   // console.log(new URLSearchParams(locationPath.search));
    // }, [locationPath.search]);

    const { data, error, isFetching } = useQuery<FilterVehiclesAPIResponse>({
        queryKey: ['filterVehicles', { ...applyingFilter, ...initialData }],
        enabled: !!applyingFilter,
        queryFn: async () => request(apiUrl, FILTER_VEHICLES, { ...applyingFilter }),
        // initialData: () => {
        //   // return queryClient.getQueryData(['filterVehicles', { ...applyingFilter }]) || initialData;
        //   return initialData!;
        // },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });

    // {
    //   vehicles: vehicleList,
    //   aggregateVehicle: {
    //     _count: { _all: resultCount }
    //   }
    //   // trim
    // },
    const vehicleList =
        initialData?.vehicles.vehicles ;
    const resultCount =
        initialData.vehicles.count;

    useEffect(() => {
        setIsLoadMore(() => false);
    }, [vehicleList]);

    // console.log(isLoadMore);
    // useEffect(() => {
    //   setIsLoadMore(false);
    //   setInitialData({
    //     vehicles: vehicleList,
    //     aggregateVehicle: {
    //       _count: { _all: resultCount }
    //     }
    //     // trim
    //   });
    // }, [vehicleList]);

    // if (!arrayEquals(trim, prevTrimList)) {
    //   setPrevTrimList(trim);
    //   if (
    //     (selectedFiltersState?.make && selectedFiltersState?.make?.length > 0) ||
    //     (selectedFiltersState?.model && selectedFiltersState?.model?.length > 0)
    //   ) {
    //     setShowTrim(() => true);
    //   } else {
    //     setShowTrim(() => false);
    //   }
    //   setTrimList(createChecklistItemList(trim as readonly string[], selectedFiltersState?.trim));
    // }

    const handleFilterStateChange = useCallback(
        useDebounce<
            [state?: FilterState, take?: number, skip?: number, sortOption?: BaseSelectOption<string>]
        >(async (state, take, skip, sortOption) => {
            handleFilterStateChangeAction(
                contextMake,
                contextModel,
                queryResult,
                state,
                take,
                skip,
                sortOption
            );
        }, 200),
        [contextMake, contextModel, queryResult]
    );

    const setParam = useCallback(
        (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => {
            setParamAction(
                searchParam,
                maxPriceParam,
                contextMake,
                contextModel,
                contextBodyType,
                handleFilterStateChange,
                data,
                sort,
                clearAll
            );
            // navigate(`/${carCondition}-vehicles-quincy-ma/`);
            // history.pushState({ undefined }, '', `/${carCondition}-vehicles-quincy-ma/`);
        },
        [
            searchParam.keys,
            searchParam.values,
            searchParam,
            navigate,
            contextMake,
            contextModel,
            handleFilterStateChange
        ]
    );

    useEffect(() => {
        const updatedParam = new URLSearchParams(locationPath.search);
        setSearchParam(updatedParam);
        readParam(
            updatedParam,
            maxPriceParam,
            contextMake,
            contextModel,
            contextBodyType,
            queryResult,
            handleFilterStateChange
        );
    }, [locationPath.search, searchParam.keys, searchParam.values]);

    // console.log('--------------->', contextMake, contextModel);

    return (
        <>
            <div className="relative mb-1 grid w-full grid-flow-col grid-cols-4 items-start justify-center pb-10 pr-0 xl:grid-cols-5 2xl:grid-cols-6 4xl:m-auto 4xl:max-w-screen-4xl">
                <div className="col-span-1 hidden lg:block ">
                    {/*<SideBarFilters*/}
                    {/*    contextMake={contextMake}*/}
                    {/*    contextModel={contextModel}*/}
                    {/*    contextBodyType={contextBodyType}*/}
                    {/*    handleFilterStateChange={handleFilterStateChange}*/}
                    {/*    setParam={setParam}*/}
                    {/*    showTrim={showTrim}*/}
                    {/*    onFilterChange={(state) => {*/}
                    {/*        handleFilterStateChange(state);*/}
                    {/*        setSelectedFiltersState(state);*/}
                    {/*        // navigateTo(carCondition);*/}
                    {/*        setParam(state, selectedSortOption);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*) : null}*/}
                </div>
                <main className="relative col-span-6 my-3 h-full w-full rounded-3xl bg-pure-gray-400 p-4 @container lg:col-span-3 lg:mb-10 lg:p-8 xl:col-span-4 xl:mt-0 2xl:col-span-5 ">


                    <CarsListBlock
                        BATCH_SIZE={20}
                        error={null}
                        isFetching={false}
                        vehicleList={vehicleList!}
                        isLoadMore={isLoadMore}
                    />


                </main>
            </div>

        </>
    );
}



// export default CarPage;
