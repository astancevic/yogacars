import React, { useState, useEffect } from 'react';
import ChecklistFilter from '../CarLists/Filters/ChecklistFilter';
import RangeFilter from '../CarLists/Filters/RangeFilter';
import { useYogaCarStore } from '@/store/yogaCarStore.ts';
import type {BaseSelectOption} from '../FormControls/Dropdown';
import ConditionFilter from '../CarLists/Filters/ConditionFilter';
import ModelFilter from '../CarLists/Filters/ModelFilter';

interface SideBarFiltersProps {
  contextMake: string | undefined;
  contextModel: string | undefined;
  contextBodyType: string | undefined;
  showTrim: boolean;
  onFilterChange: (state: FilterState) => void;
  handleFilterStateChange: (
      state?: FilterState | undefined,
      take?: number | undefined,
      skip?: number | undefined,
      sortOption?: BaseSelectOption<string> | undefined
  ) => void;
  setParam: (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => void;
  filterShow?: boolean;
  setFilterShow?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FilterState {
  price?: {
    min?: number;
    max?: number;
  };

  make?: string[];
  model?: { name: string; parent?: string }[];
  location?: string[];
  fuelType?: string[];
  bodyType?: string[];
  transmission?: string[];
  drivetrain?: string[];
  trim?: { name: string; parent?: string }[];
  exteriorColor?: string[];
  interiorColor?: string[];
  type?: string[];

  miles?: {
    min?: number;
    max?: number;
  };

  year?: {
    min?: number;
    max?: number;
  };
}

function SideBarFilters(props: SideBarFiltersProps) {
  // Get values from store
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
  const priceRange = useYogaCarStore((state) => state.priceRange);
  const priceRangeValue = useYogaCarStore((state) => state.priceRangeValue);
  const setPriceRangeValue = useYogaCarStore((state) => state.setPriceRangeValue);
  const milesRange = useYogaCarStore((state) => state.milesRange);
  const milesRangeValue = useYogaCarStore((state) => state.milesRangeValue);
  const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);
  const yearRange = useYogaCarStore((state) => state.yearRange);
  const yearRangeValue = useYogaCarStore((state) => state.yearRangeValue);
  const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
  const makeList = useYogaCarStore((state) => state.makeList);
  const modelList = useYogaCarStore((state) => state.modelList);
  const locationList = useYogaCarStore((state) => state.locationList);
  const fuelTypeList = useYogaCarStore((state) => state.fuelTypeList);
  const drivetrainList = useYogaCarStore((state) => state.drivetrainList);
  const bodyTypeList = useYogaCarStore((state) => state.bodyTypeList);

  // Effect to initialize range filter values from selectedFiltersState
  useEffect(() => {
    if (selectedFiltersState?.price && !priceRangeValue) {
      setPriceRangeValue([
        selectedFiltersState.price.min || priceRange?.[0] || 0,
        selectedFiltersState.price.max || priceRange?.[1] || 100000
      ]);
    }

    if (selectedFiltersState?.miles && !milesRangeValue) {
      setMilesRangeValue([
        selectedFiltersState.miles.min || milesRange?.[0] || 0,
        selectedFiltersState.miles.max || milesRange?.[1] || 150000
      ]);
    }

    if (selectedFiltersState?.year && !yearRangeValue) {
      setYearRangeValue([
        selectedFiltersState.year.min || yearRange?.[0] || 2015,
        selectedFiltersState.year.max || yearRange?.[1] || new Date().getFullYear() + 1
      ]);
    }
  }, [selectedFiltersState, priceRange, milesRange, yearRange]);

  // Update function for filters
  const updateOnChange = (state: FilterState) => {
    props.onFilterChange(state);
  };

  // Handle price filter changes
  const handlePriceFilterChange = (min: number, max: number) => {
    if (max === priceRange?.[1] && min === priceRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.price;
      updateOnChange(newState);
    } else {
      const newPriceState = { ...selectedFiltersState?.price };
      newPriceState.min = min;
      newPriceState.max = max;
      const newState = { ...selectedFiltersState, price: newPriceState };

      updateOnChange(newState);
      setPriceRangeValue([newPriceState.min, newPriceState.max]);
    }
  };

  // Handle make selection
  const handleMakeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.make = [...selection];

    // Filter models based on selected makes
    const filterMakeModel = selection
        .flatMap((item) => {
          return selectedFiltersState?.model === undefined
              ? []
              : selectedFiltersState?.model?.filter((model) => model?.parent === item);
        })
        ?.filter((model) => model !== undefined);

    // Update model selection or remove if none match
    if (filterMakeModel.length > 0) {
      newState.model = [...filterMakeModel];
    } else {
      delete newState.model;
    }

    updateOnChange(newState);
  };

  // Handle model selection
  const handleModelSelection = (selection: { name: string; parent?: string }[]) => {
    const newState = { ...selectedFiltersState };
    newState.model = [...selection];
    updateOnChange(newState);
  };

  // Handle year filter changes
  const handleYearFilterChange = (min: number, max: number) => {
    if (max === yearRange?.[1] && min === yearRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.year;
      updateOnChange(newState);
    } else {
      const newYearState = { ...selectedFiltersState?.year };
      newYearState.min = min;
      newYearState.max = max;

      const newState = { ...selectedFiltersState, year: newYearState };
      updateOnChange(newState);
      setYearRangeValue([newYearState.min, newYearState.max]);
    }
  };

  // Handle location selection
  const handleLocationSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.location = [...selection];
    updateOnChange(newState);
  };

  // Handle miles filter changes
  const handleMilesFilterChange = (min: number, max: number) => {
    if (max === milesRange?.[1] && min === milesRange[0]) {
      const newState = { ...selectedFiltersState };
      delete newState.miles;
      updateOnChange(newState);
    } else {
      const newMilesState = { ...selectedFiltersState?.miles };
      newMilesState.min = min;
      newMilesState.max = max;

      const newState = { ...selectedFiltersState, miles: newMilesState };
      updateOnChange(newState);
      setMilesRangeValue([newMilesState.min, newMilesState.max]);
    }
  };

  // Handle fuel type selection
  const handleFuelTypeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.fuelType = [...selection];
    updateOnChange(newState);
  };

  // Handle body type selection
  const handleBodyTypeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.bodyType = [...selection];
    updateOnChange(newState);
  };

  // Handle drivetrain selection
  const handleDrivetrainSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.drivetrain = [...selection];
    updateOnChange(newState);
  };

  // Check if this filter should show
  const shouldShowMakeFilter = () => {
    return props.contextMake !== '*' ||
        props.contextModel !== '*' ||
        (selectedFiltersState?.make?.length ?? 0) > 0;
  };

  const shouldShowModelFilter = () => {
    return props.contextModel !== '*' ||
        (selectedFiltersState?.model?.length ?? 0) > 0 ||
        (selectedFiltersState?.make?.length ?? 0) > 0;
  };

  return (
      <div className="z-50 w-full rounded-xl bg-white p-8 lg:rounded-none lg:bg-none lg:p-0 lg:shadow-none">

        {/* Price Filter */}
        {priceRange && (
            <RangeFilter
                className="border-y border-t-0 border-black/30"
                isExpanded={true}
                minRange={priceRange[0]}
                maxRange={priceRange[1]}
                minValue={priceRangeValue ? priceRangeValue[0] : undefined}
                maxValue={priceRangeValue ? priceRangeValue[1] : undefined}
                step={1000}
                title="Price"
                minLabel="Min Price"
                maxLabel="Max Price"
                format="currency"
                onChange={handlePriceFilterChange}
            />
        )}

        {/* Body Type Filter */}
        {bodyTypeList && bodyTypeList.length > 0 && (
            <ChecklistFilter
                className="border-y border-t-0 border-black/30"
                // isExpanded={
                //     !!props.contextBodyType || (selectedFiltersState?.bodyType?.length ?? 0) > 0
                // }
                title="Body Type"
                items={bodyTypeList}
                onChange={handleBodyTypeSelection}
                showItem={true}
            />
        )}

        {/* Year Filter */}
        {yearRange && (
            <RangeFilter
                className="border-y border-t-0 border-black/30"
                minRange={yearRange[0]}
                maxRange={yearRange[1]}
                minValue={yearRangeValue ? yearRangeValue[0] : undefined}
                maxValue={yearRangeValue ? yearRangeValue[1] : undefined}
                title="Year"
                rangeSelectorLabel="Model Years"
                minLabel="Min Year"
                maxLabel="Max Year"
                format="year"
                onChange={handleYearFilterChange}
            />
        )}

        {/* Make Filter */}
        {makeList && makeList.length > 0 && (
            <ChecklistFilter
                className="border-y border-t-0 border-black/30"
                isExpanded={shouldShowMakeFilter()}
                title="Make"
                items={makeList}
                onChange={handleMakeSelection}
                showItem={true}
            />
        )}

        {/* Model Filter */}
        {modelList && modelList.length > 0 && (
            <ModelFilter
                className="border-y border-t-0 border-black/30"
                isExpanded={shouldShowModelFilter()}
                title="Model"
                items={modelList}
                onChange={handleModelSelection}
                message="Please select a Make"
                showItem={shouldShowModelFilter()}
            />
        )}

        {/* Mileage Filter */}
        {milesRange && (
            <RangeFilter
                className="border-y border-t-0 border-black/30"
                minRange={milesRange[0]}
                maxRange={milesRange[1]}
                minValue={milesRangeValue ? milesRangeValue[0] : undefined}
                maxValue={milesRangeValue ? milesRangeValue[1] : undefined}
                title="Mileage"
                rangeSelectorLabel="Mileage Range"
                minLabel="Min Miles"
                maxLabel="Max Miles"
                format="distance"
                onChange={handleMilesFilterChange}
            />
        )}

        {/* Drivetrain Filter */}
        {drivetrainList && drivetrainList.length > 0 && (
            <ChecklistFilter
                className="border-b border-black/30"
                title="Drivetrain"
                items={drivetrainList}
                onChange={handleDrivetrainSelection}
                showItem={true}
            />
        )}

        {/* Location Filter */}
        {locationList && locationList.length > 0 && (
            <ChecklistFilter
                className="border-y border-t-0 border-black/30"
                title="Location"
                items={locationList}
                onChange={handleLocationSelection}
                showItem={true}
            />
        )}

        {/* Fuel Type Filter */}
        {fuelTypeList && fuelTypeList.length > 0 && (
            <ChecklistFilter
                className="border-black/30"
                title="Fuel Type"
                items={fuelTypeList}
                onChange={handleFuelTypeSelection}
                showItem={true}
            />
        )}
      </div>
  );
}

export default SideBarFilters;