import { SearchIcon, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {FilterState} from './SideBarFilters';
import type {ChecklistItem} from '../CarLists/Filters/ChecklistFilter';
import type {RangeLimits, filterKeys} from '../../lib/types';
import { useFormatCurrency } from '../CarLists/formatCurrency';
import { formatValue } from '../CarLists/Filters/RangeFilter';
import { hasAnyFilterValue } from '../../lib/utils';
import { useYogaCarStore } from '../../store/yogaCarStore';
import SearchResultsBox from './SearchResultsBox';
import type {BaseSelectOption} from '../FormControls/Dropdown';
import {navigate} from "astro:transitions/client";

interface FilterTagsProps {
  className?: string;
  contextMake: string | undefined;
  contextModel: string | undefined;
  bodyType: string | undefined;
  setParam: (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => void;
  handleFilterStateChange: (
    state?: FilterState | undefined,
    take?: number | undefined,
    skip?: number | undefined,
    sortOption?: BaseSelectOption<string> | undefined
  ) => void;
}

export default function FilterTags(props: FilterTagsProps) {
  // const [filterVisible, setFilterVisible] = useState(true);

  const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
  const setSelectedSortOption = useYogaCarStore((state) => state.setSelectedSortOption);
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
  const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
  const setApplyingFilter = useYogaCarStore((state) => state.setApplyingFilter);

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
  const setMakeList = useYogaCarStore((state) => state.setMakeList);
  const modelList = useYogaCarStore((state) => state.modelList);
  const setModelList = useYogaCarStore((state) => state.setModelList);
  const locationList = useYogaCarStore((state) => state.locationList);
  const setLocationList = useYogaCarStore((state) => state.setLocationList);
  const trimList = useYogaCarStore((state) => state.trimList);
  const setTrimList = useYogaCarStore((state) => state.setTrimList);
  const fuelTypeList = useYogaCarStore((state) => state.fuelTypeList);
  const setFuelTypeList = useYogaCarStore((state) => state.setFuelTypeList);
  const drivetrainList = useYogaCarStore((state) => state.drivetrainList);
  const setDrivetrainList = useYogaCarStore((state) => state.setDrivetrainList);
  const bodyTypeList = useYogaCarStore((state) => state.bodyTypeList);
  const setBodyTypeList = useYogaCarStore((state) => state.setBodyTypeList);
  const exteriorColorList = useYogaCarStore((state) => state.exteriorColorList);
  const setExteriorColorList = useYogaCarStore((state) => state.setExteriorColorList);
  const interiorColorList = useYogaCarStore((state) => state.interiorColorList);
  const setInteriorColorList = useYogaCarStore((state) => state.setInteriorColorList);
  const typeList = useYogaCarStore((state) => state.typeList);
  const setTypeList = useYogaCarStore((state) => state.setTypeList);
  const carCondition = useYogaCarStore((state) => state.carCondition);

  const [searchValue, setSearchValue] = useState<string>();
  const removeItem = useCallback(
    (key: filterKeys, valueToRemove: string, range?: 'min' | 'max') => {
      const newState = { ...selectedFiltersState };

      if (newState[key]) {
        if (Array.isArray(newState[key])) {
          // newState[key] = (newState[key] as string[])?.filter(
          //   (value: string) => value !== valueToRemove
          // );
          if (key === 'make') {
            if (newState.make && newState?.make?.length > 1) {
              newState.make = newState.make?.filter((value) => value !== valueToRemove);

              newState.model && newState?.model?.length > 1
                ? (newState.model = newState.model?.filter(
                    (value) => value.parent !== valueToRemove
                  ))
                : delete newState.model;

              newState.trim && newState?.trim?.length > 0
                ? (newState.trim = newState?.model
                    ?.flatMap((model) => {
                      return newState?.trim === undefined
                        ? []
                        : newState?.trim?.filter((trim) => trim.parent === model.name);
                    })
                    ?.filter((item) => item !== undefined))
                : delete newState.trim;

              // const modelToRemove = newState.model?.filter(
              //   (value) => value.parent === valueToRemove
              // );

              // console.log(modelToRemove);
              // const trimsRemains = modelToRemove?.flatMap((model) =>
              //   newState.trim?.filter((trim) => trim.parent !== model.name)
              // );

              // console.log(trimsRemains);
            } else {
              delete newState.make;
              newState.model && newState?.model?.length > 1
                ? (newState.model = newState.model?.filter(
                    (value) => value.parent !== valueToRemove
                  ))
                : delete newState.model;

              newState.trim && newState?.trim?.length > 1
                ? (newState.trim = newState?.model
                    ?.flatMap((model) => {
                      return newState?.trim === undefined
                        ? []
                        : newState?.trim?.filter((trim) => trim.parent === model.name);
                    })
                    ?.filter((item) => item !== undefined))
                : delete newState.trim;
            }
          } else if (key === 'model') {
            if (newState.model && newState?.model?.length > 1) {
              // console.log('before', newState.model, newState.trim);

              newState.trim && newState?.trim?.length > 1
                ? (newState.trim = newState?.trim?.filter((trim) => trim.parent !== valueToRemove))
                : delete newState.trim;
              newState.model = newState.model?.filter((value) => value.name !== valueToRemove);
            } else {
              newState.trim && newState?.trim?.length > 1
                ? (newState.trim = newState?.model
                    ?.flatMap((model) => {
                      return newState?.trim === undefined
                        ? []
                        : newState?.trim?.filter((trim) => trim.parent !== model.name);
                    })
                    ?.filter((item) => item !== undefined))
                : delete newState.trim;
              delete newState.model;
            }
          } else if (key === 'trim') {
            newState.trim && newState?.trim?.length > 1
              ? (newState.trim = newState.trim?.filter((value) => value.name !== valueToRemove))
              : delete newState.trim;
          } else {
            (newState[key] as string[]).length > 1
              ? (newState[key] = (newState[key] as string[])?.filter(
                  (value: string) => value !== valueToRemove
                ))
              : delete newState[key];
          }
        } else if (typeof newState[key] === 'object') {
          if (key === 'price') {
            if (range === 'max') {
              newState.price?.min === priceRange?.[0]
                ? delete newState.price
                : (newState[key] = { min: newState.price?.min, max: priceRange?.[1] });
            } else {
              newState.price?.max === priceRange?.[1]
                ? delete newState.price
                : (newState[key] = { min: priceRange?.[0], max: newState.price?.max });
            }
          }
          if (key === 'miles') {
            if (range === 'max') {
              newState.miles?.min === milesRange?.[0]
                ? delete newState.miles
                : (newState[key] = { min: newState.miles?.min, max: milesRange?.[1] });
            } else {
              newState.miles?.max === milesRange?.[1]
                ? delete newState.miles
                : (newState[key] = { min: milesRange?.[0], max: newState.miles?.max });
            }
          }
          if (key === 'year') {
            if (range === 'max') {
              newState.year?.min === yearRange?.[0]
                ? delete newState.year
                : (newState[key] = { min: newState.year?.min, max: yearRange?.[1] });
            } else {
              newState.year?.max === yearRange?.[1]
                ? delete newState.year
                : (newState[key] = { min: yearRange?.[0], max: newState.year?.max });
            }
          }
          // delete newState[key];
        }
      }

      if (Object.entries(newState).length > 0) {
        props.setParam(newState, selectedSortOption);
        props.handleFilterStateChange(newState);
        setSelectedFiltersState(newState);
        // return newState;
      } else {
        props.handleFilterStateChange(undefined);
        props.setParam(undefined);
        setSelectedFiltersState(undefined);
        history.pushState({}, '', `/${carCondition}-vehicles-quincy-ma/`);
        // return undefined;
      }

      deleteListValue(setMakeList, makeList, valueToRemove);
      deleteListValue(setModelList, modelList, valueToRemove);
      deleteListValue(setLocationList, locationList, valueToRemove);
      deleteListValue(setTrimList, trimList, valueToRemove);
      deleteListValue(setFuelTypeList, fuelTypeList, valueToRemove);
      deleteListValue(setDrivetrainList, drivetrainList, valueToRemove);
      deleteListValue(setExteriorColorList, exteriorColorList, valueToRemove);
      deleteListValue(setInteriorColorList, interiorColorList, valueToRemove);
      deleteListValue(setBodyTypeList, bodyTypeList, valueToRemove);
      deleteListValue(setTypeList, typeList, valueToRemove);

      if (key === 'price') {
        range === 'max'
          ? setPriceRangeValue([priceRangeValue?.[0], priceRange?.[1]] as RangeLimits)
          : setPriceRangeValue([priceRange?.[0], priceRangeValue?.[1]] as RangeLimits);
        // ? setPriceRangeValue((prev) => [prev?.[0], priceRange?.[1]] as RangeLimits)
        // : setPriceRangeValue((prev) => [priceRange?.[0], prev?.[1]] as RangeLimits);
      }
      if (key === 'miles') {
        range === 'max'
          ? setMilesRangeValue([milesRangeValue?.[0], milesRange?.[1]] as RangeLimits)
          : setMilesRangeValue([milesRange?.[0], milesRangeValue?.[1]] as RangeLimits);
        // ? setMilesRangeValue((prev) => [prev?.[0], milesRange?.[1]] as RangeLimits)
        // : setMilesRangeValue((prev) => [milesRange?.[0], prev?.[1]] as RangeLimits);
      }
      if (key === 'year') {
        range === 'max'
          ? setYearRangeValue([yearRangeValue?.[0], yearRange?.[1]] as RangeLimits)
          : setYearRangeValue([yearRange?.[0], yearRangeValue?.[1]] as RangeLimits);
        // ? setYearRangeValue((prev) => [prev?.[0], yearRange?.[1]] as RangeLimits)
        // : setYearRangeValue((prev) => [yearRange?.[0], prev?.[1]] as RangeLimits);
      }
    },
    [
      selectedFiltersState,
      makeList,
      modelList,
      locationList,
      trimList,
      fuelTypeList,
      drivetrainList,
      exteriorColorList,
      interiorColorList,
      bodyTypeList,
      typeList,
      priceRange,
      milesRange,
      yearRange
    ]
  );

  const clearAllFilter = useCallback(() => {
    setSelectedFiltersState && setSelectedFiltersState(undefined);
    setMakeList(makeList?.map((item) => ({ ...item, checked: false })));
    setModelList(modelList?.map((item) => ({ ...item, checked: false })));
    setLocationList(locationList?.map((item) => ({ ...item, checked: false })));
    setTrimList(trimList?.map((item) => ({ ...item, checked: false })));
    setFuelTypeList(fuelTypeList?.map((item) => ({ ...item, checked: false })));
    setDrivetrainList(drivetrainList?.map((item) => ({ ...item, checked: false })));
    setExteriorColorList(exteriorColorList?.map((item) => ({ ...item, checked: false })));
    setInteriorColorList(interiorColorList?.map((item) => ({ ...item, checked: false })));
    setBodyTypeList(bodyTypeList?.map((item) => ({ ...item, checked: false })));
    setTypeList(typeList?.map((item) => ({ ...item, checked: false })));
    // setMakeList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setModelList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setLocationList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setTrimList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setFuelTypeList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setDrivetrainList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setExteriorColorList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setInteriorColorList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setBodyTypeList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));
    // setTypeList((prevList) => prevList?.map((item) => ({ ...item, checked: false })));

    setPriceRangeValue(priceRange);
    setMilesRangeValue(milesRange);
    setYearRangeValue(yearRange);
    setSelectedSortOption(undefined);
    setApplyingFilter(undefined);
    setSearchValue('');
    props.setParam(undefined, undefined, true);
  }, [
    selectedFiltersState,
    makeList,
    modelList,
    locationList,
    trimList,
    fuelTypeList,
    drivetrainList,
    exteriorColorList,
    interiorColorList,
    bodyTypeList,
    typeList,
    priceRange,
    milesRange,
    yearRange
  ]);

  const minPrice = useFormatCurrency(priceRangeValue?.[0]!);
  const maxPrice = useFormatCurrency(priceRangeValue?.[1]!);

  const showFilterTags = useMemo(
    () => (selectedFiltersState ? hasAnyFilterValue(selectedFiltersState) : false),
    [selectedFiltersState]
  );

  function removeContextValue(remove: 'make' | 'model' | 'bodyType') {
    if (remove === 'make') {
      navigate(`/${carCondition}-vehicles-quincy-ma/`);
    }
    if (remove === 'model') {
      navigate(
        `/new-${props.contextMake === '*' ? 'vehicles' : props.contextMake?.toLowerCase()}-quincy-ma/`
      );
    }
    if (remove === 'bodyType') {
      navigate(`/${carCondition}-vehicles-quincy-ma/`);
    }
  }

  return (
    <div className="relative">
      <div className=" flex items-start justify-between gap-2 rounded-md border border-pure-gray/25 bg-white p-2">
        <div className={`flex w-full flex-wrap items-center gap-1  ${props.className}`}>
          {showFilterTags ? (
            Object.entries(selectedFiltersState!).map(([key, value], index) => {
              if (Array.isArray(value)) {
                return value.map((item, index) => {
                  if (key === 'model') {
                    // console.log('model shown in tags', selectedFiltersState?.model);

                    return (
                      <SingleItem
                        value={item?.name}
                        key={item?.name}
                        onClick={() => removeItem(key as filterKeys, item.name)}
                      />
                    );
                  } else if (
                    key === 'trim' &&
                    selectedFiltersState?.trim &&
                    selectedFiltersState?.trim?.length > 0
                  ) {
                    // console.log('trims shown in tags', selectedFiltersState?.trim);
                    return (
                      <SingleItem
                        value={item?.name}
                        key={item?.name}
                        onClick={() => removeItem(key as filterKeys, item.name)}
                      />
                    );
                  } else {
                    return (
                      <SingleItem
                        value={item}
                        key={item}
                        onClick={() => removeItem(key as filterKeys, item)}
                      />
                    );
                  }
                });
              } else if (typeof value === 'object' && value !== null && key === 'price') {
                return (
                  <>
                    {priceRange && value.max !== priceRange?.[1] && (
                      <SingleItem
                        // key={index}
                        value={`Max: ${maxPrice ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value.max, 'max')}
                      />
                    )}
                    {priceRange && value.min !== priceRange?.[0] && (
                      <SingleItem
                        // key={index}
                        value={`Min: ${minPrice ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value.min, 'min')}
                      />
                    )}
                  </>
                );
              } else if (typeof value === 'object' && value !== null && key === 'miles') {
                return (
                  <>
                    {milesRange && value.max !== milesRange[1] && (
                      <SingleItem
                        // key={index}
                        value={`Max Miles: ${formatValue(value.max, 'distance') ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value, 'max')}
                      />
                    )}
                    {milesRange && value.min !== milesRange[0] && (
                      <SingleItem
                        // key={index}
                        value={`Min Miles: ${formatValue(value.min, 'distance') ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value, 'min')}
                      />
                    )}
                  </>
                );
              } else if (typeof value === 'object' && value !== null && key === 'year') {
                return (
                  <>
                    {yearRange && value.max !== yearRange[1] && (
                      <SingleItem
                        // key={index}
                        value={`Max Year: ${formatValue(value.max, 'year') ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value, 'max')}
                      />
                    )}
                    {yearRange && value.min !== yearRange[0] && (
                      <SingleItem
                        // key={index}
                        value={`Min Year: ${formatValue(value.min, 'year') ?? ''}`}
                        onClick={() => removeItem(key as filterKeys, value, 'min')}
                      />
                    )}
                  </>
                );
              } else {
                return <SingleItem key={index} value={value ?? ''} />;
              }
            })
          ) : (
            <>
              {props.contextMake && props.contextMake !== '*' && (
                <SingleItem
                  key={props.contextMake}
                  value={props.contextMake}
                  onClick={() => removeContextValue('make')}
                />
              )}
              {props.contextModel && props.contextModel !== '*' && (
                <SingleItem
                  key={props.contextModel}
                  value={props.contextModel}
                  onClick={() => removeContextValue('model')}
                />
              )}
              {props.bodyType && props.bodyType !== '*' && (
                <SingleItem
                  key={props.bodyType}
                  value={props.bodyType ?? ''}
                  onClick={() => removeContextValue('bodyType')}
                />
              )}
            </>
          )}
          <input
            type="text"
            // placeholder="Search"
            value={searchValue}
            className="w-full min-w-12  flex-1 border-0 bg-transparent text-base outline-0  ring-0 focus:outline-0 focus:ring-0"
            onChange={async (evt) => {
              setSearchValue(evt.target.value);
            }}
          />
        </div>
        <div
          className="h-3 w-3  min-w-fit cursor-pointer py-2 text-base text-black/45 underline "
          onClick={() => clearAllFilter()}
        >
          {showFilterTags ? <X /> : <SearchIcon />}
        </div>
      </div>
      {searchValue && searchValue?.length > 1 && (
        <SearchResultsBox
          searchValue={searchValue || ''}
          setSearchValue={setSearchValue}
          setParam={props.setParam}
          handleFilterStateChange={props.handleFilterStateChange}
        />
      )}
    </div>
  );
}

interface SingleItemProps {
  onClick?: () => void;
  value: string;
}

function SingleItem({ onClick, value }: SingleItemProps) {
  return (
    <div
      className="flex min-w-fit cursor-pointer items-center justify-between gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs md:text-sm"
      onClick={() => onClick && onClick()}
    >
      <p>{value}</p>
      <X className="h-3 w-3 text-[#1E1E1ED9]/85" />
    </div>
  );
}

const deleteListValue = (
  // setList: (value: React.SetStateAction<ChecklistItem[] | undefined>) => void,
  setList: (value: ChecklistItem[] | undefined) => void,
  list: ChecklistItem[] | undefined,
  valueToRemove: string
) => {
  const updatedItems = list?.map((prevItem) => {
    if (prevItem.value === valueToRemove) {
      return { ...prevItem, checked: false };
    } else {
      return { ...prevItem };
    }
  });
  setList(updatedItems!);
};
