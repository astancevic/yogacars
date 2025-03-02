import { useYogaCarStore } from '../../store/yogaCarStore';
import React, { useCallback, useMemo, useState } from 'react';
import type {FilterState} from './SideBarFilters';
import type {filterKeys} from '@/lib/types';
import type {ChecklistItem} from '../CarLists/Filters/ChecklistFilter';
import { ScrollArea } from '../ui/scroll-area';
import type {BaseSelectOption} from '../FormControls/Dropdown';
interface SearchResultsBoxProps {
  setParam: (data?: FilterState, sort?: BaseSelectOption<string>, clearAll?: boolean) => void;
  handleFilterStateChange: (
    state?: FilterState | undefined,
    take?: number | undefined,
    skip?: number | undefined,
    sortOption?: BaseSelectOption<string> | undefined
  ) => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function SearchResultsBox({
  searchValue,
  setSearchValue,
  setParam,
  handleFilterStateChange
}: SearchResultsBoxProps) {
  const selectedSortOption = useYogaCarStore((state) => state.selectedSortOption);
  const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
  const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);

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
  const typeList = useYogaCarStore((state) => state.typeList);
  const setTypeList = useYogaCarStore((state) => state.setTypeList);

  // const [searchResult, setSearchResult] = useState<SearchResults[]>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectionChange = useCallback(
    (
      filterKey: filterKeys,
      item: ChecklistItem,
      checked: boolean,
      itemsList: ChecklistItem[] | undefined,
      setItemsList: (newItemsList: ChecklistItem[] | undefined) => void
    ) => {
      const checkedItems = itemsList?.filter((e) => e.checked).map((e) => e.value) ?? [];
      let updatedList = [...checkedItems!];

      if (checked) {
        updatedList = [...checkedItems!, item.value];
      } else {
        updatedList.splice(checkedItems!.indexOf(item.value), 1);
      }

      // setCheckedItems(Array(...new Set(updatedList)));
      // props.onChange(Array(...new Set(updatedList)));
      const newState = { ...selectedFiltersState };
      if (filterKey === 'model') {
        const filterModels = updatedList.flatMap((model) =>
          modelList?.filter((item) => item.value === model)
        );
        const models = filterModels.map((item) => ({
          name: item?.value!,
          parent: item?.parent
        }));
        newState.model = models;
      } else if (filterKey === 'trim') {
        const filterTrims = updatedList.flatMap((model) =>
          modelList?.filter((item) => item.value === model)
        );
        const trims = filterTrims.map((item) => ({
          name: item?.value!,
          parent: item?.parent
        }));
        newState.trim = trims;
      } else {
        newState[filterKey] = Array(...new Set(updatedList));
      }

      handleFilterStateChange(newState);
      setSelectedFiltersState(newState);
      // setParam(newState, selectedSortOption);

      const updatedItems = itemsList?.map((prevItem) => {
        if (prevItem.value === item.value) {
          return { ...prevItem, checked: checked };
        } else {
          return { ...prevItem };
        }
      });

      setItemsList(updatedItems);
      setSearchValue('');
    },
    [
      handleFilterStateChange,
      setSelectedFiltersState,
      selectedFiltersState,
      // setParam,
      setSearchValue
    ]
  );

  const filterMake = useMemo(
    () => makeList?.filter((make) => make.value.toLowerCase().includes(searchValue.toLowerCase())),
    [makeList, searchValue]
  );
  const filterModel = useMemo(
    () =>
      modelList?.filter((model) => model.value.toLowerCase().includes(searchValue.toLowerCase())),
    [modelList, searchValue]
  );
  const filterTrims = useMemo(
    () => trimList?.filter((trim) => trim.value.toLowerCase().includes(searchValue.toLowerCase())),
    [trimList, searchValue]
  );
  const filterType = useMemo(
    () => typeList?.filter((type) => type.value.toLowerCase().includes(searchValue.toLowerCase())),
    [typeList, searchValue]
  );
  const filterLocation = useMemo(
    () =>
      locationList?.filter((location) =>
        location.value.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [locationList, searchValue]
  );
  const filterBodyType = useMemo(
    () =>
      bodyTypeList?.filter((bodyType) =>
        bodyType.value.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [bodyTypeList, searchValue]
  );
  const filterFuelType = useMemo(
    () =>
      fuelTypeList?.filter((fuelType) =>
        fuelType.value.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [fuelTypeList, searchValue]
  );
  const filterDrivetrain = useMemo(
    () =>
      drivetrainList?.filter((drivetrain) =>
        drivetrain.value.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [drivetrainList, searchValue]
  );

  const resultsFound = useMemo(() => {
    if (
      filterMake?.length! > 0 ||
      filterModel?.length! > 0 ||
      filterTrims?.length! > 0 ||
      filterType?.length! > 0 ||
      filterLocation?.length! > 0 ||
      filterBodyType?.length! > 0 ||
      filterFuelType?.length! > 0 ||
      filterDrivetrain?.length! > 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    filterMake,
    filterModel,
    filterTrims,
    filterType,
    filterLocation,
    filterBodyType,
    filterFuelType,
    filterDrivetrain
  ]);

  // const searchHandle = useDebounce<[]>(async () => {
  //   // async function searchHandle() {
  //   try {
  //     if (searchValue && searchValue?.length > 3) {
  //       setIsLoading(true);
  //       // console.log(searchValue);
  //       const res = await fetch(
  //         `https://yogacars-search-production.up.railway.app/?search=${encodeURI(searchValue)} `,
  //         // `http://localhost:3000/?search=${encodeURI(searchValue)} `,
  //         {
  //           method: 'GET'
  //         }
  //       );
  //       const result = await res.json();
  //       // console.log(result);
  //       setSearchResult(result.results);
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, 500);

  // useEffect(() => {
  //   void searchHandle();
  // }, [searchValue]);

  return (
    <div className="absolute z-30 my-2 w-full rounded-md border border-pure-gray/25 bg-white p-2">
      {(
          <ScrollArea type="always">
            <div className="max-h-56 ">
              {/* {isLoading
              ? 'Searching...'
              : searchResult && searchResult?.length < 1
                ? 'No car found.'
                : searchResult?.map((result, index) => {
                    // const data = JSON.parse(result.document);
                    // console.log(result);
                    return (
                      <div>
                        {index > 7 ? (
                          <Link
                            // to={`/listing/${vin}`}
                            to={createVehicleDetailSlug({
                              type: result.type as Queries.Type,
                              year: result.year,
                              make: { name: result.makeName },
                              model: { name: result.modelName },
                              trim: result.trim,
                              dealerCity: result.dealerCity,
                              dealerState: result.dealerState,
                              vin: result.vin
                            })}
                            className={`my-2 flex cursor-pointer items-center overflow-hidden rounded-2xl bg-gray-100  p-2 lg:px-2 xl:max-h-52`}
                          >
                            <img src={result.heroImageUrl} alt="hero-image" className="h-10 w-10" />

                            <div className="w-full rounded-b-2xl bg-gray-100 p-2 ">


                              <span>
                                <h2 className="mt-1 ">
                                  {result.makeName} {result.modelName} {result.trim}{' '}
                                  {result.drivetrain} {result.vin}
                                </h2>
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <div
                            className="cursor-pointer py-1 pl-4 font-normal hover:bg-pure-gray-400"
                            onClick={() => {
                              const newState: FilterState = {
                                make: [result.makeName],
                                model: [result.modelName],
                                trim: [result.trim],
                                drivetrain: [result.drivetrain]
                              };
                              setSelectedFiltersState(newState);
                              handleFilterStateChange(newState);
                              setParam(newState);
                              setSearchValue('');
                            }}
                          >
                            {result.makeName} {result.modelName} {result.trim} {result.drivetrain}{' '}
                            {result.vin}
                          </div>
                        )}
                      </div>
                    );
                  })} */}

              {resultsFound ? (
                  <>
                    <SearchList
                        heading="Makes"
                        filterKey="make"
                        itemList={filterMake}
                        prevItemList={makeList}
                        setItemList={setMakeList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Models"
                        filterKey="model"
                        itemList={filterModel}
                        prevItemList={modelList}
                        setItemList={setModelList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Trims"
                        filterKey="trim"
                        itemList={filterTrims}
                        prevItemList={trimList}
                        setItemList={setTrimList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Type"
                        filterKey="type"
                        itemList={filterType}
                        prevItemList={typeList}
                        setItemList={setTypeList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Location"
                        filterKey="location"
                        itemList={filterLocation}
                        prevItemList={locationList}
                        setItemList={setLocationList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Body Type"
                        filterKey="bodyType"
                        itemList={filterBodyType}
                        prevItemList={bodyTypeList}
                        setItemList={setBodyTypeList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Fuel Type"
                        filterKey="bodyType"
                        itemList={filterFuelType}
                        prevItemList={fuelTypeList}
                        setItemList={setFuelTypeList}
                        handleSelectionChange={handleSelectionChange}
                    />
                    <SearchList
                        heading="Drivetrain"
                        filterKey="drivetrain"
                        itemList={filterDrivetrain}
                        prevItemList={drivetrainList}
                        setItemList={setDrivetrainList}
                        handleSelectionChange={handleSelectionChange}
                    />
                  </>
              ) : (
                  <p>No Car Found</p>
              )}
            </div>
          </ScrollArea>
      )}
    </div>
  );
}

interface SearchListProps {
  heading: string;
  filterKey: filterKeys;
  itemList: ChecklistItem[] | undefined;
  prevItemList: ChecklistItem[] | undefined;
  setItemList: (newTypeList: ChecklistItem[] | undefined) => void;
  handleSelectionChange: (
    filterKey: filterKeys,
    item: ChecklistItem,
    checked: boolean,
    itemsList: ChecklistItem[] | undefined,
    setItemsList: (newItemsList: ChecklistItem[] | undefined) => void
  ) => void;
}

function SearchList({
  heading,
  filterKey,
  itemList,
  prevItemList,
  setItemList,
  handleSelectionChange
}: SearchListProps) {
  return (
    <>
      {itemList && itemList?.length > 0 && (
        <ul className="text-base font-bold">
          {heading}:
          {itemList.map((item) => (
            <li
              className="cursor-pointer py-1 pl-4 font-normal hover:bg-pure-gray-400"
              onClick={() =>
                handleSelectionChange(filterKey, item, true, prevItemList, setItemList)
              }
            >
              {' '}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
