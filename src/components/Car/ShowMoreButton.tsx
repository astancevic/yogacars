import React from 'react';
import type { FilterState } from './SideBarFilters';
import type { APIVehicle } from '@/lib/types.ts';
import { useYogaCarStore } from '@/store/yogaCarStore.ts';
import { hasAnyFilterValue } from '@/lib/utils';
import type { BaseSelectOption } from '../FormControls/Dropdown';

interface ShowMoreButtonProps {
  handleFilterStateChange: (
      state?: FilterState | undefined,
      take?: number | undefined,
      skip?: number | undefined,
      sortOption?: BaseSelectOption<string> | undefined
  ) => void;

  vehicleList: APIVehicle[];
  contextMake?: string;
  contextModel?: string;
  bodyType?: string;
  isFetching: boolean;
  setIsLoadMore: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShowMoreButton({
                                         handleFilterStateChange,
                                         vehicleList,
                                         contextMake,
                                         contextModel,
                                         bodyType,
                                         setIsLoadMore,
                                         isFetching
                                       }: ShowMoreButtonProps) {
  const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);

  return (
      <div className="mt-16 flex w-full items-center justify-center 3xl:h-0">
        <button
            className="rounded bg-primary px-7 py-2 text-xl font-semibold text-black border-2 border-primary hover:bg-white hover:text-primary"
            onClick={() => {
              if (!selectedFiltersState || !hasAnyFilterValue(selectedFiltersState)) {
                const newState: FilterState = {
                  make: [],
                  model: [],
                  bodyType: []
                };

                if (contextMake && contextMake !== '*') newState.make?.push(contextMake);
                if (contextModel && contextModel !== '*') {
                  newState.model?.push({ name: contextModel, parent: contextMake });
                }
                if (bodyType) newState.bodyType?.push(bodyType);

                setSelectedFiltersState(newState);
              }

              handleFilterStateChange(undefined, 24, vehicleList.length);
              setIsLoadMore(true);
            }}
            disabled={isFetching}
        >
          {isFetching ? 'Loading...' : 'Show More Cars'}
        </button>
      </div>
  );
}
