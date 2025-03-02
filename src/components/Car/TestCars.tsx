// import React, { useCallback, useEffect, useState } from 'react';
// import SideBarFilters, {type FilterState } from './SideBarFilters';
// import SortAndViewSection from './SortAndViewSection';
// import CarsListBlock from './CarsListBlock';
// import ShowMoreButton from './ShowMoreButton';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import { useYogaCarStore } from '../../store/yogaCarStore';
// import SideBarFiltersForMobile from './SideBarFilterForMobile';
// import { BaseSelectOption } from '../FormControls/Dropdown';
// import useDebounce from '../../lib/hooks/useDebounce';
// import { Vehicle, VehiclesResponse, fetchVehicles } from '../../data/vehicles';
//
// interface CarPageProps {
//     initialData: VehiclesResponse;
//     setInitialData: (data: VehiclesResponse) => void;
//     BATCH_SIZE: number;
//     contextMake: string;
//     contextModel: string;
//     contextBodyType: string;
//     maxPriceParam: number;
//     queryResult: any;
//     screenWidth: number;
// }
//
// const CarPage: React.FC<CarPageProps> = ({
//                                              initialData,
//                                              setInitialData,
//                                              BATCH_SIZE,
//                                              contextMake,
//                                              contextModel,
//                                              contextBodyType,
//                                              maxPriceParam,
//                                              queryResult,
//                                              screenWidth,
//                                          }) => {
//     const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
//     const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
//     const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
//     const setParamAction = useYogaCarStore((state) => state.setParamAction);
//     const handleFilterStateChangeAction = useYogaCarStore((state) => state.handleFilterStateChangeAction);
//
//     const [showTrim, setShowTrim] = useState<boolean>(() => contextMake !== '*' || contextModel !== '*');
//     const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
//
//     const { data, error, isFetching } = useQuery<VehiclesResponse>({
//         queryKey: ['filterVehicles', applyingFilter],
//         enabled: !!applyingFilter,
//         queryFn: () => fetchVehicles(applyingFilter),
//         placeholderData: keepPreviousData,
//         refetchOnWindowFocus: false,
//     });
//
//     const vehicleList = data?.vehicles || initialData.vehicles;
//     const resultCount = data?.aggregateVehicle?._count?._all || initialData.aggregateVehicle._count._all;
//
//     useEffect(() => {
//         setIsLoadMore(false);
//     }, [vehicleList]);
//
//     const handleFilterStateChange = useCallback(
//         useDebounce((state: FilterState, take?: number, skip?: number, sortOption?: BaseSelectOption) => {
//             handleFilterStateChangeAction(contextMake, contextModel, queryResult, state, take, skip, sortOption);
//         }, 200),
//         [contextMake, contextModel, queryResult]
//     );
//
//     const setParam = useCallback(
//         (data: FilterState, sort?: BaseSelectOption, clearAll?: boolean) => {
//             setParamAction(
//                 maxPriceParam,
//                 contextMake,
//                 contextModel,
//                 contextBodyType,
//                 handleFilterStateChange,
//                 data,
//                 sort,
//                 clearAll
//             );
//         },
//         [contextMake, contextModel, handleFilterStateChange]
//     );
//
//     return (
//         <div className="relative mb-1 grid w-full grid-flow-col grid-cols-4 items-start justify-center pb-10 pr-0 xl:grid-cols-5 2xl:grid-cols-6">
//             <div className="col-span-1 hidden lg:block">
//                 {screenWidth >= 1024 && (
//                     <SideBarFilters
//                         contextMake={contextMake}
//                         contextModel={contextModel}
//                         contextBodyType={contextBodyType}
//                         handleFilterStateChange={handleFilterStateChange}
//                         setParam={setParam}
//                         showTrim={showTrim}
//                         onFilterChange={(state) => {
//                             handleFilterStateChange(state);
//                             setSelectedFiltersState(state);
//                             setParam(state, selectedSortOption);
//                         }}
//                     />
//                 )}
//             </div>
//
//             <main className="relative col-span-6 my-3 h-full w-full rounded-3xl bg-gray-200 p-4 lg:col-span-3 lg:mb-10 lg:p-8 xl:col-span-4 2xl:col-span-5">
//                 <SortAndViewSection
//                     contextMake={contextMake}
//                     contextModel={contextModel}
//                     bodyType={contextBodyType}
//                     showTrim={showTrim}
//                     handleFilterStateChange={handleFilterStateChange}
//                     isFetching={isFetching}
//                     resultCount={resultCount}
//                     setParam={setParam}
//                 />
//                 <CarsListBlock BATCH_SIZE={BATCH_SIZE} error={error} isFetching={isFetching} vehicleList={vehicleList} isLoadMore={isLoadMore} />
//                 {vehicleList.length < resultCount && (
//                     <ShowMoreButton
//                         handleFilterStateChange={handleFilterStateChange}
//                         vehicleList={vehicleList}
//                         contextMake={contextMake}
//                         contextModel={contextModel}
//                         bodyType={contextBodyType}
//                         setIsLoadMore={setIsLoadMore}
//                         isFetching={isFetching}
//                     />
//                 )}
//             </main>
//
//             <div className="fixed bottom-4 right-4 lg:hidden">
//                 {screenWidth < 1024 && (
//                     <SideBarFiltersForMobile
//                         contextMake={contextMake}
//                         contextModel={contextModel}
//                         contextBodyType={contextBodyType}
//                         handleFilterStateChange={handleFilterStateChange}
//                         showTrim={showTrim}
//                         setParam={setParam}
//                         resultCount={resultCount}
//                         isFetching={isFetching}
//                         onFilterChange={(state) => {
//                             handleFilterStateChange(state);
//                             setSelectedFiltersState(state);
//                             setParam(state, selectedSortOption);
//                         }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default CarPage;
