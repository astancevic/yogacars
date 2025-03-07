import React, { useCallback, useEffect, useState } from 'react';
import type { APIVehicle } from '@/lib/types.ts';
import CarsListBlock from './CarsListBlock';
import { useYogaCarStore } from '@/store/yogaCarStore';
import useDebounce from '../../lib/hooks/useDebounce.ts';
import SideBarFilters, { type FilterState } from "@/components/Car/SideBarFilters.tsx";
import type { BaseSelectOption } from "@/components/FormControls/Dropdown.tsx";
import SortAndViewSection, { sortList } from "@/components/Car/SortAndViewSection";
import ShowMoreButton from "@/components/Car/ShowMoreButton.tsx";

type InitialData = {
    vehicles: APIVehicle[];
    count: number;
};

interface CarPageProps {
    initialData: InitialData;
    initialFilters: any; // Filter options from the API
    apiUrl: string;
    urlParams?: Record<string, string>; // URL parameters passed from index.astro
}

export default function CarPage({ initialData, initialFilters, apiUrl, urlParams = {} }: CarPageProps) {
    // State for vehicle data
    const [vehicles, setVehicles] = useState<APIVehicle[]>(initialData.vehicles);
    const [totalCount, setTotalCount] = useState<number>(initialData.count);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<URLSearchParams | null>(null);
    const [showTrim, setShowTrim] = useState<boolean>(false);

    // Get store values and actions
    const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
    const setSelectedSortOption = useYogaCarStore((state) => state.setSelectedSortOption);
    const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
    const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
    const setPriceRange = useYogaCarStore((state) => state.setPriceRange);
    const setPriceRangeValue = useYogaCarStore((state) => state.setPriceRangeValue);
    const setMilesRange = useYogaCarStore((state) => state.setMilesRange);
    const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);
    const setYearRange = useYogaCarStore((state) => state.setYearRange);
    const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
    const setMakeList = useYogaCarStore((state) => state.setMakeList);
    const setModelList = useYogaCarStore((state) => state.setModelList);
    const setLocationList = useYogaCarStore((state) => state.setLocationList);
    const setFuelTypeList = useYogaCarStore((state) => state.setFuelTypeList);
    const setDrivetrainList = useYogaCarStore((state) => state.setDrivetrainList);
    const setBodyTypeList = useYogaCarStore((state) => state.setBodyTypeList);
    const setTypeList = useYogaCarStore((state) => state.setTypeList);
    const contextMake = useYogaCarStore((state) => state.contextMake);
    const setContextMake = useYogaCarStore((state) => state.setContextMake);
    const contextModel = useYogaCarStore((state) => state.contextModel);
    const setContextModel = useYogaCarStore((state) => state.setContextModel);
    const contextBodyType = useYogaCarStore((state) => state.contextBodyType);
    const setContextBodyType = useYogaCarStore((state) => state.setContextBodyType);
    const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
    const setApplyingFilter = useYogaCarStore((state) => state.setApplyingFilter);
    const handleFilterStateChangeAction = useYogaCarStore((state) => state.handleFilterStateChangeAction);

    // Initialize searchParam from provided URL parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // If we're on the client side, get URL params from the browser
            const params = new URLSearchParams(window.location.search);
            setSearchParam(params);
        } else if (urlParams && Object.keys(urlParams).length > 0) {
            // If we're on the server side, use the provided urlParams
            const params = new URLSearchParams();
            Object.entries(urlParams).forEach(([key, value]) => {
                params.set(key, value);
            });
            setSearchParam(params);
        }
    }, [urlParams]);

    // Reset isLoadMore when vehicles update
    useEffect(() => {
        setIsLoadMore(false);
    }, [vehicles]);

    // Create helper functions for checklist items
    function createChecklistItems(items: string[] = [], selectedValues: string[] = []) {
        if (!items || !Array.isArray(items)) return [];

        return items.map(item => ({
            value: item,
            label: item,
            checked: selectedValues.includes(item)
        }));
    }

    function createModelChecklistItems(models: any[] = [], selectedValues: string[] = []) {
        if (!models || !Array.isArray(models)) return [];

        return models.map(model => ({
            value: model.name,
            label: model.name,
            parent: model.parent,
            checked: selectedValues.includes(model.name)
        }));
    }

    // Initialize filter values from initialFilters
    useEffect(() => {
        if (initialFilters) {
            // Set range filters
            if (initialFilters.price) {
                setPriceRange([initialFilters.price.min, initialFilters.price.max]);
            }

            if (initialFilters.miles) {
                setMilesRange([initialFilters.miles.min, initialFilters.miles.max]);
            }

            if (initialFilters.year) {
                setYearRange([initialFilters.year.min, initialFilters.year.max]);
            }

            // Create checklist items for all filter types
            setMakeList(createChecklistItems(initialFilters.make));
            setModelList(createModelChecklistItems(initialFilters.model));
            setLocationList(createChecklistItems(initialFilters.location));
            setFuelTypeList(createChecklistItems(initialFilters.fuelType));
            setDrivetrainList(createChecklistItems(initialFilters.drivetrain));
            setBodyTypeList(createChecklistItems(initialFilters.bodyType));

            // Set vehicle type (new/used)
            if (initialFilters.type) {
                setTypeList(createChecklistItems(initialFilters.type));
            }
        }
    }, [initialFilters]);

    // Fetch filtered vehicles
    const fetchFilteredVehicles = async (filterState?: FilterState) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();

            // Helper function to add filters
            const addFilter = (key: string, values?: string[] | { name: string, parent?: string }[]) => {
                if (values && values.length > 0) {
                    const processedValues = Array.isArray(values)
                        ? values.map(v => typeof v === 'string' ? v : v.name)
                        : values;
                    params.append(key, processedValues.join(','));
                }
            };

            // Helper function to add range filters
            const addRangeFilter = (prefix: string, range?: { min?: number; max?: number }) => {
                if (range) {
                    if (range.min !== undefined) {
                        params.append(`min${prefix}`, range.min.toString());
                    }
                    if (range.max !== undefined) {
                        params.append(`max${prefix}`, range.max.toString());
                    }
                }
            };

            // Apply filters from filterState
            if (filterState) {
                // Array filters
                addFilter('make', filterState.make);
                addFilter('model', filterState.model);
                addFilter('bodyType', filterState.bodyType);
                addFilter('fuelType', filterState.fuelType);
                addFilter('drivetrain', filterState.drivetrain);
                addFilter('location', filterState.location);

                // Range filters
                addRangeFilter('Price', filterState.price);
                addRangeFilter('Miles', filterState.miles);
                addRangeFilter('Year', filterState.year);
            }

            // Add sorting if available
            if (selectedSortOption) {
                params.append('orderBy', selectedSortOption.value.toLowerCase().replace(' ', '_'));
            }

            // Execute API call
            const response = await fetch(`${apiUrl}/api/vehicles?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch vehicles');

            const data = await response.json();
            setVehicles(data.vehicles || []);
            setTotalCount(data.count || 0);
            setError(null);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    // Set URL parameters
    const setParam = useCallback(
        (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => {
            if (!searchParam) return;

            if (clearAll) {
                // Update URL without page reload
                window.history.replaceState({}, '', '/');
                return;
            }

            // Create a copy of searchParam to modify
            const newParams = new URLSearchParams();

            // Add sort parameter
            if (sort && typeof sort.id === 'number') {
                newParams.set('sort', sort.label.replace(/ /g, '_'));
            }

            // Add context parameters if not all (*)
            if (contextMake !== '*' && contextMake) {
                newParams.set('make', contextMake);
            }

            if (contextModel !== '*' && contextModel) {
                newParams.set('model', contextModel);
            }

            if (contextBodyType) {
                newParams.set('bodyType', contextBodyType);
            }

            // Add filter parameters
            if (data && Object.keys(data).length > 0) {
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'price' && value) {
                        const { min, max } = value;
                        const priceRange = initialFilters.price || { min: 0, max: 100000 };

                        if (min !== priceRange.min) {
                            newParams.set('minPrice', min.toString());
                        }

                        if (max !== priceRange.max) {
                            newParams.set('maxPrice', max.toString());
                        }
                    } else if (key === 'miles' && value) {
                        const { min, max } = value;
                        const milesRange = initialFilters.miles || { min: 0, max: 100000 };

                        if (min !== milesRange.min) {
                            newParams.set('minMiles', min.toString());
                        }

                        if (max !== milesRange.max) {
                            newParams.set('maxMiles', max.toString());
                        }
                    } else if (key === 'year' && value) {
                        const { min, max } = value;
                        const yearRange = initialFilters.year || { min: 2015, max: new Date().getFullYear() + 1 };

                        if (min !== yearRange.min) {
                            newParams.set('minYear', min.toString());
                        }

                        if (max !== yearRange.max) {
                            newParams.set('maxYear', max.toString());
                        }
                    } else if (key === 'model' && Array.isArray(value) && value.length > 0) {
                        newParams.set('model', value.map(item => item.name).join(','));
                    } else if (Array.isArray(value) && value.length > 0) {
                        newParams.set(key, value.join(','));
                    }
                });
            }

            // Build the query string
            const queryString = newParams.toString();

            // Update URL without page reload
            const newUrl = queryString ? `/?${queryString}` : '/';
            window.history.replaceState({}, '', newUrl);

            // Update the searchParam state
            setSearchParam(newParams);
        },
        [searchParam, contextMake, contextModel, contextBodyType, initialFilters]
    );
    {console.log(vehicles && vehicles?.length < totalCount)}

    // Set up filter state change handler
    const handleFilterStateChange = useCallback(
        useDebounce((state?: FilterState) => {
            // Directly fetch vehicles with the new filter state
            console.log('Applying filter state:', state);
            fetchFilteredVehicles(state);

            // Update store state
            if (state) {
                setSelectedFiltersState(state);
            }
        }, 300),
        [apiUrl, selectedSortOption]
    );

    // Effect to fetch vehicles when filters change
    useEffect(() => {
        if (applyingFilter) {
            fetchFilteredVehicles(applyingFilter);
        }
    }, [applyingFilter]);

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
                        setParam(state, selectedSortOption);
                    }}
                />
            </div>

            <main className="relative col-span-6 my-3 h-full wfull w-full rounded-3xl bg-pure-gray-400 p-4 @container lg:col-span-3 lg:mb-10 lg:p-8 xl:col-span-4 xl:mt-0 2xl:col-span-5">
                <SortAndViewSection
                    contextMake={contextMake}
                    contextModel={contextModel}
                    bodyType={contextBodyType}
                    showTrim={showTrim}
                    handleFilterStateChange={handleFilterStateChange}
                    isFetching={isLoading}
                    resultCount={totalCount!}
                    setParam={setParam}
                />
                <CarsListBlock
                    BATCH_SIZE={20}
                    error={error}
                    isFetching={isLoading}
                    vehicleList={vehicles}
                    isLoadMore={isLoadMore}
                />
                {vehicles && vehicles?.length < totalCount! && (
                    <ShowMoreButton
                        handleFilterStateChange={handleFilterStateChange}
                        vehicleList={vehicles}
                        contextMake={contextMake}
                        contextModel={contextModel}
                        bodyType={contextBodyType}
                        setIsLoadMore={setIsLoadMore}
                        isFetching={isLoading}
                    />
                )}
            </main>
        </div>
    );
}