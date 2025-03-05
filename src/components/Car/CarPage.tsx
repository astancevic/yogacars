import React, { useCallback, useEffect, useState } from 'react';
import type { APIVehicle } from '../../lib/types';
import CarsListBlock from './CarsListBlock';
import { useYogaCarStore } from '@/store/yogaCarStore';
import useDebounce from '../../lib/hooks/useDebounce.ts';
import SideBarFilters, { type FilterState } from "@/components/Car/SideBarFilters.tsx";
import { navigate } from "astro:transitions/client";
import type { BaseSelectOption } from "@/components/FormControls/Dropdown.tsx";

type InitialData = {
    vehicles: APIVehicle[];
    count: number;
};

interface CarPageProps {
    initialData: InitialData;
    initialFilters : FilterState; // Passed as prop
}

export default function CarPage({ initialData, initialFilters }: CarPageProps) {
    const apiUrl = import.meta.env.API_URL;

    const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
    const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);

    const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
    const handleFilterStateChangeAction = useYogaCarStore((state) => state.handleFilterStateChangeAction);
    const contextMake = 'subaru';
    const setParamAction = useYogaCarStore((state) => state.setParamAction);
    const readParam = useYogaCarStore((state) => state.readParam);

    const contextModel = '*';
    const [searchParam, setSearchParam] = useState<URLSearchParams | null>();
    console.log(searchParam);
    const contextBodyType = useYogaCarStore((state) => state.contextBodyType);

    // const { data, error, isFetching } = useQuery<FilterVehiclesAPIResponse>({
    //     queryKey: ['filterVehicles', { ...applyingFilter, ...initialData }],
    //     enabled: !!applyingFilter,
    //     queryFn: async () => request(apiUrl, FILTER_VEHICLES, { ...applyingFilter }),
    //     // initialData: () => {
    //     //   // return queryClient.getQueryData(['filterVehicles', { ...applyingFilter }]) || initialData;
    //     //   return initialData!;
    //     // },
    //     placeholderData: keepPreviousData,
    //     refetchOnWindowFocus: false
    // });
    // Local state for vehicle data, loading status, and errors
    const [vehicles, setVehicles] = useState<APIVehicle[]>(initialData.vehicles);
    const [totalCount, setTotalCount] = useState<number>(initialData.count);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    useEffect(() => {
        setIsLoadMore(() => false);
    }, [vehicles]);



    // Effect: Fetch vehicles whenever filter, sort, or context parameters change
    // useEffect(() => {
    //     console.log(1111);
    //     async function loadVehicles() {
    //         setIsLoading(true);
    //         try {
    //             const filterParams = {
    //                 ...applyingFilter,
    //                 contextMake,
    //                 contextModel,
    //                 contextBodyType,
    //                 orderBy: selectedSortOption?.value || 'year DESC',
    //             };
    //             // Fetch the vehicle list and count from SQLite
    //             const vehicleResponse = await fetch('http://localhost:4322/api/vehicles'); // Adjust API URL as needed
    //             const { vehicles, count } = await vehicleResponse.json();
    //             setVehicles(vehicles);
    //             setTotalCount(count);
    //             setError(null);
    //         } catch (err) {
    //             console.error('Error fetching vehicles:', err);
    //             setError(new Error('Error fetching vehicles'));
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     console.log(1222);
    //     loadVehicles();
    // }, [applyingFilter, selectedSortOption, contextMake, contextModel, contextBodyType]);

    // Optional: Handle filters and update URL params in a way Astro can react to
    console.log(4444)
    // useEffect(() => {
    //     console.log(1);
    //     if (typeof window !== 'undefined') {
    //         const params = new URLSearchParams(window.location.search);
    //         setSearchParam(params); // Update searchParam in state
    //     }
    // }, []);


    // Handling show trim state
    const [showTrim, setShowTrim] = useState<boolean>(false);

    const handleFilterStateChange = useCallback(
        useDebounce<
            [state?: FilterState, take?: number, skip?: number, sortOption?: BaseSelectOption<string>]
        >(async (state, take, skip, sortOption) => {
            console.log(3333333333333333333333);
            handleFilterStateChangeAction(
                contextMake,
                contextModel,
                initialData,
                state,
                take,
                skip,
                sortOption
            );
        }, 200),
        [contextMake, contextModel, initialData]
    );

    const setParam = useCallback(
        (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => {
            console.log(11112222);

            if (searchParam) {
                setParamAction(
                    searchParam,
                    2000000,
                    contextMake,
                    contextModel,
                    contextBodyType,
                    handleFilterStateChange,
                    data,
                    sort,
                    clearAll
                );
            }
        },
        [searchParam, setParamAction, contextMake, contextModel, handleFilterStateChange]
    );

    useEffect(() => {

        if (searchParam) {
            setParam();
        }
    }, []);

    return (
        <div className="relative mb-1 grid w-full grid-flow-col grid-cols-4 items-start justify-center pb-10 pr-0 xl:grid-cols-5 2xl:grid-cols-6 4xl:m-auto 4xl:max-w-screen-4xl">
            <div className="col-span-1 hidden lg:block">
                <SideBarFilters
                    contextMake={contextMake}
                    contextModel={contextModel}
                    contextBodyType={contextBodyType}
                    handleFilterStateChange={handleFilterStateChange}
                    setParam={setParam}
                    showTrim={showTrim}
                    onFilterChange={(state) => {
                        handleFilterStateChange(state);
                        setSelectedFiltersState(state);
                        setParam(state, selectedSortOption);
                    }}
                />
            </div>

            <main className="relative col-span-6 my-3 h-full w-full rounded-3xl bg-pure-gray-400 p-4 @container lg:col-span-3 lg:mb-10 lg:p-8 xl:col-span-4 xl:mt-0 2xl:col-span-5">
                <CarsListBlock
                    BATCH_SIZE={20}
                    error={error}
                    isFetching={isLoading}
                    vehicleList={vehicles}
                    isLoadMore={isLoadMore}
                />
            </main>
        </div>
    );
}
