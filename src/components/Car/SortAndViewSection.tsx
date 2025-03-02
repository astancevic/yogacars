import React from 'react';
import type {FilterState} from './SideBarFilters';
import ViewToggle from './ViewToggle';
import { useYogaCarStore } from '@/store/yogaCarStore.ts';
import FilterTags from './FilterTags';
import {type BaseSelectOption, Dropdown } from '../FormControls/Dropdown';

interface SortAndViewSectionProps {
  contextMake: string | undefined;
  contextModel: string | undefined;
  bodyType: string | undefined;
  isFetching: boolean;
  showTrim: boolean;
  resultCount: number;
  handleFilterStateChange: (
    state?: FilterState | undefined,
    take?: number | undefined,
    skip?: number | undefined,
    sortOption?: BaseSelectOption<string> | undefined
  ) => void;
  setParam: (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => void;
}

export const sortList: BaseSelectOption<string>[] = [
  { id: 4, value: 'Newest', label: 'Newest' },
  { id: 1, value: 'Highest Price', label: 'Highest Price' },
  { id: 2, value: 'Lowest Price', label: 'Lowest Price' },
  { id: 3, value: 'Highest Mileage', label: 'Highest Mileage' },
  { id: 5, value: 'Lowest Mileage', label: 'Lowest Mileage' }
];

export default function SortAndViewSection({
  resultCount,
  isFetching,
  showTrim,
  handleFilterStateChange,
  setParam,
  contextMake,
  contextModel,
  bodyType
}: SortAndViewSectionProps) {
  // const { setSelectedSortOption, selectedFiltersState } = useFilterContext();
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
  const setSelectedSortOption = useYogaCarStore((state) => state.setSelectedSortOption);
  return (
    <>
      <div className="w-full">
        {/* {selectedFiltersState && hasAnyFilterValue(selectedFiltersState) ? (
            <FilterTags setParam={setParam} handleFilterStateChange={handleFilterStateChange} />
            ) : null} */}
        <FilterTags
          contextMake={contextMake}
          contextModel={contextModel}
          bodyType={bodyType}
          setParam={setParam}
          handleFilterStateChange={handleFilterStateChange}
        />
      </div>
      <div className="flex w-full  flex-row  items-center justify-between gap-4 py-2">
        <div className="w-48 text-base font-bold md:w-fit md:text-2xl 3xl:text-3xl">
          {isFetching ? 'Please wait...' : `${resultCount} Results`}
        </div>
        <div className="z-10  mt-2  flex w-full   basis-2/5 flex-wrap items-center justify-end gap-2 md:ml-5 md:mt-0 md:w-fit md:justify-end md:gap-3 lg:w-80 lg:basis-1/2 xl:basis-1/3 3xl:basis-1/4">
          {/* <div className="w-fit lg:hidden">
            <SideBarFiltersForMobile
              handleFilterStateChange={handleFilterStateChange}
              showTrim={showTrim}
              setParam={setParam}
              onFilterChange={(state) => {
                handleFilterStateChange(state);
                setSelectedFiltersState(state);
                setParam(state);
              }}
            />
          </div> */}
          <ViewToggle />
          <Dropdown
            className="w-40 md:w-48 md:flex-none "
            variant="dark"
            listBoxClassName="w-40 md:w-48"
            options={sortList}
            placeholder="Sort By"
            onChange={(selection) => {
              handleFilterStateChange(undefined, undefined, undefined, selection);
              setSelectedSortOption(selection);
              setParam(selectedFiltersState, selection);
            }}
          />
        </div>
      </div>
    </>
  );
}
