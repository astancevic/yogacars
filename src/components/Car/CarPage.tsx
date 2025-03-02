import React, { useCallback, useEffect, useState } from 'react';
import type { APIVehicle } from '../../lib/types';
import CarsListBlock from './CarsListBlock';
import { useYogaCarStore } from '@/store/yogaCarStore';
import useDebounce from '../../lib/hooks/useDebounce.ts';
import { fetchVehicles, fetchVehicleCount } from '../../lib/vehicles.ts';
import SideBarFilters, { type FilterState } from "@/components/Car/SideBarFilters.tsx";
import { navigate } from "astro:transitions/client";
import type { BaseSelectOption } from "@/components/FormControls/Dropdown.tsx";

type InitialData = {
    vehicles: APIVehicle[];
    count: number;
};

interface CarPageProps {
    initialData: InitialData;
}

export default function CarPage({ initialData }: CarPageProps) {
    // Retrieve necessary values from your global store
    const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
    const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
    const contextMake = 'subaru';
    const setParamAction = useYogaCarStore((state) => state.setParamAction);
    const contextModel = '*';
    const [searchParam, setSearchParam] = useState<URLSearchParams | null>(null);
    const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);

    const contextBodyType = useYogaCarStore((state) => state.contextBodyType);
    const handleFilterStateChangeAction = useYogaCarStore((state) => state.handleFilterStateChangeAction);

    // Local state for vehicle data, loading status, and errors
    const [vehicles, setVehicles] = useState<APIVehicle[]>(initialData.vehicles);
    const [totalCount, setTotalCount] = useState<number>(initialData.count);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

    // Effect: Fetch vehicles whenever filter, sort, or context parameters change
    useEffect(() => {
        async function loadVehicles() {
            setIsLoading(true);
            try {
                const filterParams = {
                    ...applyingFilter,
                    contextMake,
                    contextModel,
                    contextBodyType,
                    orderBy: selectedSortOption?.value || 'year DESC',
                };
                // Fetch the vehicle list and count from SQLite
                const fetchedVehicles = await fetchVehicles(filterParams);
                const countResult = await fetchVehicleCount(filterParams);
                setVehicles(fetchedVehicles);
                setTotalCount(countResult);
                setError(null);
            } catch (err) {
                console.error('Error fetching vehicles:', err);
                setError(new Error('Error fetching vehicles'));
            } finally {
                setIsLoading(false);
            }
        }
        console.log(1222);
        loadVehicles();
    }, [applyingFilter, selectedSortOption, contextMake, contextModel, contextBodyType]);

    // Optional: Handle filters and update URL params in a way Astro can react to
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            // Parse params and update store or local state if needed
            // For example: readParam(params, contextMake, contextModel, contextBodyType, debouncedFilterChange);
            setSearchParam(params); // Update searchParam in state
        }
    }, []);

    // Handling show trim state
    const [showTrim, setShowTrim] = useState<boolean>(false);

    const handleFilterStateChange = useCallback(
        useDebounce<
            [state?: FilterState, take?: number, skip?: number, sortOption?: BaseSelectOption<string>]
        >(async (state, take, skip, sortOption) => {
            console.log(1111);
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
                        // navigateTo(carCondition);
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
