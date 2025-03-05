import React, { useState } from 'react';
import ChecklistFilter from '../CarLists/Filters/ChecklistFilter';
import RangeFilter from '../CarLists/Filters/RangeFilter';
import { useYogaCarStore } from '../../store/yogaCarStore';
// import TrimFilter from '../CarLists/Filters/TrimFilter';
import type {BaseSelectOption} from '../FormControls/Dropdown';
import ConditionFilter from '../CarLists/Filters/ConditionFilter';
import ModelFilter from '../CarLists/Filters/ModelFilter';

interface SideBarFiltersProps {
  // yearRange: RangeLimits;
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
  // model?: string[];
  location?: string[];
  fuelType?: string[];
  bodyType?: string[];
  transmission?: string[];
  drivetrain?: string[];
  trim?: { name: string; parent?: string }[];
  // trim?: string[];
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
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
console.log(selectedFiltersState);
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
  console.log('bodyTypeList')
  // FILTER HANDLERS
  const updateOnChange = (state: FilterState) => {
    props.onFilterChange(state);
  };

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
  // const handlePriceFilterChange = useDebounce<[min: number, max: number]>((min, max) => {
  //   if (max === priceRange?.[1] && min === priceRange[0]) {
  //     const newState = { ...selectedFiltersState };
  //     delete newState.price;
  //     updateOnChange(newState);
  //   } else {
  //     const newPriceState = { ...selectedFiltersState?.price };
  //     newPriceState.min = min;
  //     newPriceState.max = max;
  //     const newState = { ...selectedFiltersState, price: newPriceState };

  //     updateOnChange(newState);
  //     setPriceRangeValue([newPriceState.min, newPriceState.max]);
  //   }
  // }, 1000);
  // console.log({ filterMakeModel });
  const handleMakeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.make = [...selection];

    const filterMakeModel = selection
      .flatMap((item) => {
        return selectedFiltersState?.model === undefined
          ? []
          : selectedFiltersState?.model?.filter((model) => model?.parent === item);
      })
      ?.filter((model) => model !== undefined);

    newState.model = filterMakeModel;

    if (filterMakeModel.length > 0) {
      newState.model = [...filterMakeModel];
    } else {
      delete newState.model;
    }

    const filterModelTrim = filterMakeModel
      .flatMap((item) => {
        return selectedFiltersState?.trim === undefined
          ? []
          : selectedFiltersState?.trim?.filter((trim) => trim.parent === item.name);
      })
      ?.filter((trim) => trim !== undefined);

    // newState.trim = filterModelTrim;
    if (filterModelTrim.length > 0) {
      newState.trim = [...filterModelTrim];
    } else {
      delete newState.trim;
    }

    updateOnChange(newState);
  };

  const handleModelSelection = (selection: { name: string; parent?: string }[]) => {
    const newState = { ...selectedFiltersState };
    // newState.model = [...selection.map((item) => item.name)];
    newState.model = [...selection];

    const filterModelTrim = selection
      .flatMap((item) => {
        return selectedFiltersState?.trim === undefined
          ? []
          : selectedFiltersState?.trim?.filter((trim) => trim.parent === item.name);
      })
      ?.filter((trim) => trim !== undefined);

    newState.trim = filterModelTrim;
    updateOnChange(newState);
  };

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

  const handleLocationSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.location = [...selection];

    updateOnChange(newState);
  };

  const handTypeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.type = [...selection];

    updateOnChange(newState);
  };

  const handleTrimSelection = (selection: { name: string; parent?: string }[]) => {
    const newState = { ...selectedFiltersState };
    newState.trim = [...selection];

    updateOnChange(newState);
  };

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

  const handleFuelTypeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.fuelType = [...selection];

    updateOnChange(newState);
  };

  const handleBodyTypeSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.bodyType = [...selection];

    updateOnChange(newState);
  };

  // const handleTransmissionSelection = (selection: string[]) => {
  //   const newState = { ...selectedFiltersState };
  //   newState.transmission = [...selection];

  //   updateOnChange(newState);
  // };

  const handleDrivetrainSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.drivetrain = [...selection];

    updateOnChange(newState);
  };

  const handleExteriorColorSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.exteriorColor = [...selection];

    updateOnChange(newState);
  };

  const handleInteriorColorSelection = (selection: string[]) => {
    const newState = { ...selectedFiltersState };
    newState.interiorColor = [...selection];

    updateOnChange(newState);
  };
  console.log(priceRangeValue)

  return (
    <div
      className={` z-50 w-full rounded-xl bg-white  p-8 lg:rounded-none lg:bg-none lg:p-0 lg:shadow-none`}
    >
      {/* <FilterTags
        setParam={props.setParam}
        handleFilterStateChange={props.handleFilterStateChange}
      /> */}
      <ConditionFilter />
      {/* <ChecklistFilter
        className="border-y border-t-0 border-black/30 "
        isExpanded={true}
        title="Type"
        items={typeList!}
        setItems={setTypeList}
        onChange={handTypeSelection}
        showItem={true}
      /> */}
      <RangeFilter
        className="border-y border-t-0 border-black/30  "
        isExpanded={true}
        minRange={priceRange?.[0]!}
        maxRange={priceRange?.[1]!}
        minValue={priceRangeValue ? priceRangeValue[0] : undefined}
        maxValue={priceRangeValue ? priceRangeValue[1] : undefined}
        step={1000}
        title="Price"
        // rangeSelectorLabel="Average Price Range"
        minLabel="Min Price"
        maxLabel="Max Price"
        format="currency"
        onChange={handlePriceFilterChange}
      />

      <ChecklistFilter
        className="border-y border-t-0 border-black/30 "
        isExpanded={
          props.contextBodyType || selectedFiltersState?.bodyType?.length! > 0 ? true : false
        }
        title="Body Type"
        items={bodyTypeList!}
        setItems={setBodyTypeList}
        onChange={handleBodyTypeSelection}
        showItem={true}
      />

      <RangeFilter
        className="border-y border-t-0 border-black/30 "
        minRange={yearRange?.[0]!}
        maxRange={yearRange?.[1]!}
        minValue={yearRangeValue ? yearRangeValue[0] : undefined}
        maxValue={yearRangeValue ? yearRangeValue[1] : undefined}
        title="Year"
        rangeSelectorLabel="Model Years"
        minLabel="Min Year"
        maxLabel="Max Year"
        format="year"
        onChange={handleYearFilterChange}
      />

      <ChecklistFilter
        className="border-y border-t-0 border-black/30 "
        isExpanded={
          props.contextMake !== '*' ||
          props.contextModel !== '*' ||
          selectedFiltersState?.make?.length! > 0
            ? true
            : false
        }
        title="Make"
        items={makeList!}
        setItems={setMakeList}
        onChange={handleMakeSelection}
        showItem={true}
      />

      <ModelFilter
        className="border-y border-t-0 border-black/30 "
        isExpanded={
          props.contextModel !== '*' || selectedFiltersState?.model?.length! > 0 ? true : false
        }
        title="Model"
        items={modelList!}
        setItems={setModelList}
        onChange={handleModelSelection}
        message="Please select a Make"
        showItem={
          selectedFiltersState?.make?.length! > 0 ||
          selectedFiltersState?.model?.length! > 0 ||
          (props.contextMake && props.contextMake !== '*') ||
          (props.contextModel && props.contextModel !== '*')
            ? true
            : false
        }
      />

      {/* {props.showTrim && ( */}
      {/*<TrimFilter*/}
      {/*  className="border-y border-t-0 border-black/30 "*/}
      {/*  title="Trim"*/}
      {/*  items={trimList!}*/}
      {/*  setItems={setTrimList}*/}
      {/*  onChange={handleTrimSelection}*/}
      {/*  showItem={true}*/}
      {/*  contextModel={props.contextModel}*/}
      {/*  // message="Please select a Model"*/}
      {/*  // showItem={selectedFiltersState?.model?.length! > 0 ? true : false}*/}
      {/*/>*/}
      {/* )} */}


      <RangeFilter
        className="border-y border-t-0 border-black/30 "
        minRange={milesRange?.[0]!}
        maxRange={milesRange?.[1]!}
        minValue={milesRangeValue ? milesRangeValue[0] : undefined}
        maxValue={milesRangeValue ? milesRangeValue[1] : undefined}
        title="Mileage"
        rangeSelectorLabel="Mileage Range"
        minLabel="Min Miles"
        maxLabel="Max Miles"
        format="distance"
        onChange={handleMilesFilterChange}
      />

      <ChecklistFilter
        className="border-b border-black/30 "
        title="Drivetrain"
        items={drivetrainList!}
        setItems={setDrivetrainList}
        onChange={handleDrivetrainSelection}
        showItem={true}
      />

      <ChecklistFilter
        className="border-y border-t-0 border-black/30 "
        // isExpanded={true}
        title="Location"
        items={locationList!}
        setItems={setLocationList}
        onChange={handleLocationSelection}
        showItem={true}
      />

      <ChecklistFilter
        className=" border-black/30 "
        title="Fuel Type"
        items={fuelTypeList!}
        setItems={setFuelTypeList}
        onChange={handleFuelTypeSelection}
        showItem={true}
      />
    </div>
  );
}

export default SideBarFilters;

function CheckTest() {
  const [checked, setChecked] = useState<string[]>([]);
  const checkList = ['Apple', 'Banana', 'Tea', 'Coffee'];

  const handleCheck = (event: any) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ', ' + item;
      })
    : '';

  return (
    <>
      <div className="list-container">
        {checkList.map((item, index) => (
          <div key={index}>
            <input value={item} type="checkbox" onChange={handleCheck} />
            <span className={checked.includes(item) ? 'font-bold' : ''}>{item}</span>
          </div>
        ))}
      </div>
      <div>{`Items checked are: ${checkedItems}`}</div>
    </>
  );
}
