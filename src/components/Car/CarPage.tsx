import React, { useCallback, useEffect, useState } from 'react';
import type { APIVehicle } from '@/lib/types.ts';
import CarsListBlock from './CarsListBlock';
import { useYogaCarStore } from '@/store/yogaCarStore';
import useDebounce from '../../lib/hooks/useDebounce.ts';
import SideBarFilters, { type FilterState } from "@/components/Car/SideBarFilters.tsx";
import { navigate } from "astro:transitions/client";
import type { BaseSelectOption } from "@/components/FormControls/Dropdown.tsx";
import { sortList } from "@/components/Car/SortAndViewSection";

type InitialData = {
    vehicles: APIVehicle[];
    count: number;
};

interface CarPageProps {
    initialData: InitialData;
    initialFilters: any; // Filter options from the API
    apiUrl: string;
}

export default function CarPage({ initialData, initialFilters, apiUrl }: CarPageProps) {
    // State for vehicle data
    const [vehicles, setVehicles] = useState<APIVehicle[]>(initialData.vehicles);
    const [totalCount, setTotalCount] = useState<number>(initialData.count);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);

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

    // URL search parameters
    const [searchParam, setSearchParam] = useState<URLSearchParams | null>(null);

    useEffect(() => {
        // Reset isLoadMore when vehicles update
        setIsLoadMore(false);
    }, [vehicles]);

    // Initialize searchParam from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setSearchParam(params);
        }
    }, []);

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

    // Helper function to create checklist items
    function createChecklistItems(items: string[] = [], selectedValues: string[] = []) {
        if (!items || !Array.isArray(items)) return [];

        return items.map(item => ({
            value: item,
            label: item,
            checked: selectedValues.includes(item)
        }));
    }

    // Helper function to create model checklist items with parent info
    function createModelChecklistItems(models: any[] = [], selectedValues: string[] = []) {
        if (!models || !Array.isArray(models)) return [];

        return models.map(model => ({
            value: model.name,
            label: model.name,
            parent: model.parent,
            checked: selectedValues.includes(model.name)
        }));
    }

    const fetchFilteredVehicles = async (filters: any) => {
        if (!filters) return;

        setIsLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams();

            // Add filters
            if (filters.where) {
                Object.entries(filters.where).forEach(([key, value]) => {
                    if (value === null || value === undefined) return;

                    if (typeof value === 'object') {
                        // Handle range filters with proper type checking
                        if ('gte' in value && value.gte !== null && value.gte !== undefined) {
                            params.append(`${key}_min`, String(value.gte));
                        }

                        if ('lte' in value && value.lte !== null && value.lte !== undefined) {
                            params.append(`${key}_max`, String(value.lte));
                        }

                        if ('in' in value && Array.isArray(value.in) && value.in.length > 0) {
                            params.append(key, value.in.join(','));
                        }

                        if ('equals' in value && value.equals !== null && value.equals !== undefined) {
                            params.append(`${key}_equals`, String(value.equals));
                        }
                    } else if (value !== null && value !== undefined) {
                        // For primitive values, convert to string
                        params.append(key, String(value));
                    }
                });
            }

            // Add pagination
            if (filters.take !== null && filters.take !== undefined) {
                params.append('take', String(filters.take));
            }

            if (filters.skip !== null && filters.skip !== undefined) {
                params.append('skip', String(filters.skip));
            }

            // Add ordering
            if (filters.orderBy && Array.isArray(filters.orderBy) && filters.orderBy.length > 0) {
                const orderBy = filters.orderBy[0];
                if (orderBy && typeof orderBy === 'object') {
                    for (const [key, direction] of Object.entries(orderBy)) {
                        if (key) {
                            params.append('orderBy', key);

                            if (direction !== null && direction !== undefined) {
                                if (typeof direction === 'object' && 'sort' in direction && direction.sort) {
                                    params.append('direction', String(direction.sort));
                                } else {
                                    params.append('direction', String(direction));
                                }
                            }
                            break; // Only use first ordering
                        }
                    }
                }
            }

            // Execute the API call
            const response = await fetch(`${apiUrl}/api/vehicles?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch vehicles');

            const data = await response.json();
            setVehicles(data.vehicles);
            setTotalCount(data.count);
            setError(null);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    };


    // Initialize filters from URL parameters
    const initializeFiltersFromUrl = (params: URLSearchParams) => {
        const newFilterState: FilterState = {};

        // Parse make filter
        if (params.has('make')) {
            const makeValue = params.get('make');
            if (makeValue) {
                const makeValues = makeValue.split(',');
                newFilterState.make = makeValues;
                setContextMake(makeValues[0]);
            }
        }

        // Parse model filter
        if (params.has('model')) {
            const modelValue = params.get('model');
            if (modelValue) {
                const modelValues = modelValue.split(',');
                const models = initialFilters.model
                    .filter((model: any) => modelValues.includes(model.name))
                    .map((model: any) => ({
                        name: model.name,
                        parent: model.parent
                    }));

                newFilterState.model = models;
                if (models.length > 0) {
                    setContextModel(models[0].name);
                }
            }
        }

        // Parse body type filter
        if (params.has('bodyType')) {
            const bodyTypeValue = params.get('bodyType');
            if (bodyTypeValue) {
                const bodyTypeValues = bodyTypeValue.split(',');
                newFilterState.bodyType = bodyTypeValues;
                setContextBodyType(bodyTypeValues[0]);
            }
        }

        // Parse price range
        if (params.has('minPrice') || params.has('maxPrice')) {
            const minPrice = params.has('minPrice') ? params.get('minPrice') : null;
            const maxPrice = params.has('maxPrice') ? params.get('maxPrice') : null;

            const min = minPrice ? Number(minPrice) : initialFilters.price?.min || 0;
            const max = maxPrice ? Number(maxPrice) : initialFilters.price?.max || 100000;

            newFilterState.price = { min, max };
            setPriceRangeValue([min, max]);
        }

        // Parse miles range
        if (params.has('minMiles') || params.has('maxMiles')) {
            const minMiles = params.has('minMiles') ? params.get('minMiles') : null;
            const maxMiles = params.has('maxMiles') ? params.get('maxMiles') : null;

            const min = minMiles ? Number(minMiles) : initialFilters.miles?.min || 0;
            const max = maxMiles ? Number(maxMiles) : initialFilters.miles?.max || 100000;

            newFilterState.miles = { min, max };
            setMilesRangeValue([min, max]);
        }

        // Parse year range
        if (params.has('minYear') || params.has('maxYear')) {
            const minYear = params.has('minYear') ? params.get('minYear') : null;
            const maxYear = params.has('maxYear') ? params.get('maxYear') : null;

            const min = minYear ? Number(minYear) : initialFilters.year?.min || 2015;
            const max = maxYear ? Number(maxYear) : initialFilters.year?.max || new Date().getFullYear() + 1;

            newFilterState.year = { min, max };
            setYearRangeValue([min, max]);
        }

        // Parse other list filters
        const listFilters = ['fuelType', 'drivetrain', 'location'];
        listFilters.forEach(filter => {
            if (params.has(filter)) {
                const value = params.get(filter);
                if (value) {
                    newFilterState[filter] = value.split(',');
                }
            }
        });

        // Set the filter state in store if we have any filters
        if (Object.keys(newFilterState).length > 0) {
            setSelectedFiltersState(newFilterState);
            handleFilterStateChange(newFilterState);
        }

        // Parse sorting
        if (params.has('sort')) {
            const sortParam = params.get('sort');
            if (sortParam) {
                const sortParamValue = sortParam.replace(/_/g, ' ');
                const sortOption = sortList.find(option => option.label === sortParamValue);
                if (sortOption) {
                    setSelectedSortOption(sortOption);
                }
            }
        }
    };

    // Effect to initialize from URL when searchParam is available
    useEffect(() => {
        if (searchParam && searchParam.size > 0 && initialFilters) {
            initializeFiltersFromUrl(searchParam);
        }
    }, [searchParam, initialFilters]);

    // Effect to fetch vehicles when filters change
    useEffect(() => {
        if (applyingFilter) {
            fetchFilteredVehicles(applyingFilter);
        }
    }, [applyingFilter]);

    // Set up filter state change handler
    const handleFilterStateChange = useCallback(
        useDebounce<
            [state?: FilterState, take?: number, skip?: number, sortOption?: BaseSelectOption<string>]
        >(async (state, take, skip, sortOption) => {
            handleFilterStateChangeAction(
                contextMake,
                contextModel,
                { ...initialFilters },
                state,
                take,
                skip,
                sortOption || selectedSortOption
            );
        }, 200),
        [contextMake, contextModel, initialFilters, selectedSortOption]
    );

    // Set URL parameters
    const setParam = useCallback(
        (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => {
            if (!searchParam) return;

            if (clearAll) {
                // Clear all parameters
                searchParam.forEach((_, key) => {
                    searchParam.delete(key);
                });

                navigate(`/${useYogaCarStore.getState().carCondition}-vehicles-quincy-ma/`);
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
            const carCondition = useYogaCarStore.getState().carCondition;

            // Navigate to the new URL
            if (queryString) {
                navigate(`/${carCondition}-vehicles-quincy-ma/?${queryString}`);
            } else {
                navigate(`/${carCondition}-vehicles-quincy-ma/`);
            }

            // Update the searchParam state
            setSearchParam(newParams);
        },
        [searchParam, contextMake, contextModel, contextBodyType, initialFilters]
    );

    // Handle showing trim option
    const [showTrim, setShowTrim] = useState<boolean>(false);

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