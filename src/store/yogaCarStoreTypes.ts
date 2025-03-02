import type {FilterState} from '@/components/Car/SideBarFilters';
import type {ChecklistItem} from '@/components/CarLists/Filters/ChecklistFilter';
import type {BaseSelectOption} from '@/components/FormControls/Dropdown';
import type {FilterGraphQueryVariables, RangeLimits, filterKeys} from '@/lib/types';

export interface YogaCarStore {
  selectedView: 'list' | 'grid';
  setSelectedView: (view: 'list' | 'grid') => void;

  selectedSortOption: BaseSelectOption<string> | undefined;
  setSelectedSortOption: (newSelection: BaseSelectOption<string> | undefined) => void;

  selectedFiltersState: FilterState | undefined;
  setSelectedFiltersState: (newSate: FilterState | undefined) => void;

  priceRange: RangeLimits | undefined;
  setPriceRange: (newPriceRange: RangeLimits | undefined) => void;

  priceRangeValue: RangeLimits | undefined;
  setPriceRangeValue: (newPriceRangeValue: RangeLimits | undefined) => void;

  milesRange: RangeLimits | undefined;
  setMilesRange: (newMilesRange: RangeLimits | undefined) => void;

  milesRangeValue: RangeLimits | undefined;
  setMilesRangeValue: (newMilesRangeValue: RangeLimits | undefined) => void;

  yearRange: RangeLimits | undefined;
  setYearRange: (newYearRange: RangeLimits | undefined) => void;

  yearRangeValue: RangeLimits | undefined;
  setYearRangeValue: (newYearRangeValue: RangeLimits | undefined) => void;

  makeList: ChecklistItem[] | undefined;
  setMakeList: (newMakeList: ChecklistItem[] | undefined) => void;

  modelList: ChecklistItem[] | undefined;
  setModelList: (newModelList: ChecklistItem[] | undefined) => void;

  locationList: ChecklistItem[] | undefined;
  setLocationList: (newLocationList: ChecklistItem[] | undefined) => void;

  trimList: ChecklistItem[] | undefined;
  setTrimList: (newTrimList: ChecklistItem[] | undefined) => void;

  fuelTypeList: ChecklistItem[] | undefined;
  setFuelTypeList: (newFuelTypeList: ChecklistItem[] | undefined) => void;

  drivetrainList: ChecklistItem[] | undefined;
  setDrivetrainList: (newDrivetrainList: ChecklistItem[] | undefined) => void;

  transmissionList: ChecklistItem[] | undefined;
  setTransmissionList: (newTransmissionList: ChecklistItem[] | undefined) => void;

  bodyTypeList: ChecklistItem[] | undefined;
  setBodyTypeList: (newBodyTypeList: ChecklistItem[] | undefined) => void;

  exteriorColorList: ChecklistItem[] | undefined;
  setExteriorColorList: (newExteriorColorList: ChecklistItem[] | undefined) => void;

  interiorColorList: ChecklistItem[] | undefined;
  setInteriorColorList: (newInteriorColorList: ChecklistItem[] | undefined) => void;

  typeList: ChecklistItem[] | undefined;
  setTypeList: (newTypeList: ChecklistItem[] | undefined) => void;

  carCondition: 'new' | 'used';
  setCarCondition: (newCarCondition: 'new' | 'used') => void;

  applyingFilter: FilterGraphQueryVariables | undefined;
  setApplyingFilter: (newApplyingFilter: FilterGraphQueryVariables | undefined) => void;

  removeItem: (key: filterKeys, valueToRemove: string, range?: 'min' | 'max') => void;
  readParam: (
    searchParam: URLSearchParams,
    maxPriceParam: number,
    contextMake: string | undefined,
    contextModel: string | undefined,
    contextBodyType: string | undefined,
    queryResult: Queries.InitialCarsListAndFiltersDataQuery,
    handleFilterStateChange: (
      state?: FilterState | undefined,
      take?: number | undefined,
      skip?: number | undefined,
      sortOption?: BaseSelectOption<string> | undefined
    ) => void
  ) => void;
  setParamAction: (
    searchParam: URLSearchParams,
    maxPriceParam: number,
    contextMake: string | undefined,
    contextModel: string | undefined,
    contextBodyType: string | undefined,
    handleFilterStateChange: (
      state?: FilterState | undefined,
      take?: number | undefined,
      skip?: number | undefined,
      sortOption?: BaseSelectOption<string> | undefined
    ) => void,
    data?: FilterState,
    sort?: BaseSelectOption<string>,
    clearAll?: boolean
  ) => void;

  handleFilterStateChangeAction: (
    contextMake: string | undefined,
    contextModel: string | undefined,
    queryResult: Queries.InitialCarsListAndFiltersDataQuery,
    state?: FilterState | undefined,
    take?: number | undefined,
    skip?: number | undefined,
    sortOption?: BaseSelectOption<string> | undefined
  ) => void;
}
