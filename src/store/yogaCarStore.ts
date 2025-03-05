import type {FilterState} from '@/components/Car/SideBarFilters';
// import { FilterState } from '@/components/Car/SideBarFilters';
import { sortList } from '@/components/Car/SortAndViewSection';
import type {
  FilterGraphQueryVariables,
} from '@/lib/types';
import {
  createChecklistItemList,
  createModelsChecklistItemList,
  createTrimChecklistItemList,
  getSearchParam,
  hasAnyFilterValue
} from '@/lib/utils';
import { create } from 'zustand';
import type {YogaCarStore} from './yogaCarStoreTypes';
import {navigate} from "astro:transitions/client";
import {string} from "zod";

export const useYogaCarStore = create<YogaCarStore>((set, get) => ({
  selectedView: 'grid',
  setSelectedView: (view: 'list' | 'grid') => {
    set(() => ({ selectedView: view }));
  },

  selectedSortOption: undefined,
  setSelectedSortOption(newSelection) {
    set(() => ({ selectedSortOption: newSelection }));
  },

  selectedFiltersState: undefined,
  setSelectedFiltersState: (newState) => {
    set(() => ({ selectedFiltersState: { ...newState } }));
  },
  priceRange: undefined,
  setPriceRange(newPriceRange) {
    set(() => ({ priceRange: newPriceRange }));
  },

  priceRangeValue: undefined,
  setPriceRangeValue(newPriceRangeValue) {
    set(() => ({ priceRangeValue: newPriceRangeValue }));
  },

  milesRange: undefined,
  setMilesRange(newMilesRange) {
    set(() => ({ milesRange: newMilesRange }));
  },

  milesRangeValue: undefined,
  setMilesRangeValue(newMilesRangeValue) {
    set(() => ({ milesRangeValue: newMilesRangeValue }));
  },

  yearRange: undefined,
  setYearRange(newYearRange) {
    set(() => ({ yearRange: newYearRange }));
  },

  yearRangeValue: undefined,
  setYearRangeValue(newYearRangeValue) {
    set(() => ({ yearRangeValue: newYearRangeValue }));
  },

  makeList: undefined,
  setMakeList(newMakeList) {
    set(() => ({ makeList: newMakeList }));
  },

  modelList: undefined,
  setModelList(newModelList) {
    set(() => ({ modelList: newModelList }));
  },

  locationList: undefined,
  setLocationList(newLocationList) {
    set(() => ({ locationList: newLocationList }));
  },

  trimList: undefined,
  setTrimList(newTrimList) {
    set(() => ({ trimList: newTrimList }));
  },

  fuelTypeList: undefined,
  setFuelTypeList(newFuelTypeList) {
    set(() => ({ fuelTypeList: newFuelTypeList }));
  },

  drivetrainList: undefined,
  setDrivetrainList(newDrivetrainList) {
    set(() => ({ drivetrainList: newDrivetrainList }));
  },

  transmissionList: undefined,
  setTransmissionList(newTransmissionList) {
    set(() => ({ transmissionList: newTransmissionList }));
  },

  bodyTypeList: undefined,
  setBodyTypeList(newBodyTypeList) {
    set(() => ({ bodyTypeList: newBodyTypeList }));
  },

  exteriorColorList: undefined,
  setExteriorColorList(newExteriorColorList) {
    set(() => ({ exteriorColorList: newExteriorColorList }));
  },

  interiorColorList: undefined,
  setInteriorColorList(newInteriorColorList) {
    set(() => ({ interiorColorList: newInteriorColorList }));
  },

  typeList: undefined,
  setTypeList(newTypeList) {
    set(() => ({ typeList: newTypeList }));
  },

  carCondition: 'new',
  setCarCondition(newCarCondition) {
    set(() => ({ carCondition: newCarCondition }));
  },

  applyingFilter: undefined,
  setApplyingFilter(newApplyingFilter) {
    set(() => ({ applyingFilter: newApplyingFilter }));
  },

  contextMake: '*',
  setContextMake: (newContextMake) => set({ contextMake: newContextMake }),
  contextModel: '*',
  setContextModel: (newContextModel) => set({ contextModel: newContextModel }),
  contextBodyType: '*',
  setContextBodyType: (newContextBodyType) => set({ contextBodyType: newContextBodyType }),


  removeItem(key, valueToRemove, range) {},

  readParam: (
    searchParam,
    maxPriceParam,
    contextMake,
    contextModel,
    contextBodyType,
    queryResult,
    handleFilterStateChange
  ) => {
    if (searchParam.size > 0 || maxPriceParam) {
      const sortParam = searchParam.get('sort');

      const sortValue = sortList.filter((list) => {
        if (list.value === sortParam?.replace('_', ' ')) {
          return list;
        } else {
          return undefined;
        }
      });
      get().setSelectedSortOption(sortValue[0]);

      const data: FilterState = {};

      const paramsToExtract = [
        'make',
        'model',
        'location',
        'trim',
        'drivetrain',
        'fuelType',
        'bodyType',
        'exteriorColor',
        'interiorColor',
        'type'
      ];
      paramsToExtract.forEach((param) => {
        const paramValue = getSearchParam(param, searchParam);
        if (paramValue)
          data[
            param as
              | 'make'
              // | 'model'
              | 'location'
              // | 'trim'
              | 'drivetrain'
              | 'fuelType'
              | 'bodyType'
              | 'exteriorColor'
              | 'interiorColor'
              | 'type'
          ] = paramValue;
      });

      const modelParam = getSearchParam('model', searchParam);
      const modelFiltered = modelParam?.flatMap((model) =>
        queryResult.allModel.nodes
          .map((item) => {
            if (item.name === model) {
              return { name: item.name!, parent: item.makeName! };
            }
          })
          .filter((item) => item !== undefined)
      );
      // const uniqueModel = data?.make
      //   ?.flatMap((make) => modelFiltered?.filter((model) => model?.parent === make))
      //   .filter((item) => item !== undefined);

      const uniqueModel = modelFiltered?.reduce(
        (
          acc: (
            | {
                name: string;
                parent: string;
              }
            | undefined
          )[],
          current
        ) => {
          if (!acc.some((item) => item?.name === current?.name)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );
      if (uniqueModel && uniqueModel?.length > 0) {
        // console.log('modelParam', modelParam, modelFiltered);
        data.model = uniqueModel as unknown as { name: string; parent: string }[];
      }

      const trimParam = getSearchParam('trim', searchParam);
      if (get().trimList === undefined) {
        if (trimParam && trimParam.length > 0) {
          data.trim = trimParam?.map((item) => ({ name: item, parent: undefined }));
        }
      } else {
        const trimFiltered = trimParam?.flatMap((trim) =>
          get()
            .trimList?.map((item) => {
              if (item.value === trim) {
                return { name: item.value!, parent: item.parent! };
              }
            })
            .filter((item) => item !== undefined)
        );
        if (trimFiltered && trimFiltered.length > 0) {
          data.trim = trimFiltered as unknown as { name: string; parent: string }[];
        }
      }

      const minPrice = Number(searchParam.get('minPrice'));
      const maxPrice = maxPriceParam ? maxPriceParam : Number(searchParam.get('maxPrice'));
      const priceParam =
        minPrice || maxPrice
          ? {
              min: minPrice === 0 ? queryResult.priceRange.min ?? 0 : minPrice,
              max:
                maxPrice === 0
                  ? Math.ceil((queryResult.priceRange.max ?? 100000) / 10000) * 10000
                  : maxPrice
            }
          : undefined;

      const minMiles = Number(searchParam.get('minMiles'));
      const maxMiles = Number(searchParam.get('maxMiles'));
      const milesParam =
        minMiles || maxMiles
          ? {
              min: minMiles === 0 ? queryResult.milesRange.min ?? 0 : minMiles,
              max:
                maxMiles === 0
                  ? Math.ceil((queryResult.milesRange.max ?? 100000) / 100) * 100
                  : maxMiles
            }
          : undefined;

      const minYear = Number(searchParam.get('minYear'));
      const maxYear = Number(searchParam.get('maxYear'));
      const yearParam =
        minYear || maxYear
          ? {
              min: minYear === 0 ? queryResult.yearRange.min ?? 2016 : minYear,
              max: maxYear === 0 ? queryResult.yearRange.max ?? 2024 : maxYear
            }
          : undefined;

      if (priceParam) data.price = priceParam;
      if (milesParam) data.miles = milesParam;
      if (yearParam) data.year = yearParam;

      // console.log('data', data);
      get().setSelectedFiltersState(data);
      handleFilterStateChange(data);
      get().setPriceRangeValue([data.price?.min!, maxPriceParam ?? data.price?.max!]);
      get().setMilesRangeValue([data.miles?.min!, data.miles?.max!]);
      get().setYearRangeValue([data.year?.min!, data.year?.max!]);
      get().setMakeList(createChecklistItemList(queryResult.allMake.nodes, data.make));
      get().setModelList(
        createModelsChecklistItemList(
          queryResult.allModel.nodes,
          data?.model?.map((item) => item?.name!)
        )
      );
      get().setLocationList(createChecklistItemList(queryResult.locations.distinct, data.location));
      // if (get().trimList !== undefined) {
      const trimArray = get().trimList?.map((item) => ({
        name: item.value,
        model: { name: item.parent! }
      }));
      get().setTrimList(
        createTrimChecklistItemList(
          { trim: trimArray! },
          data?.trim?.map((item) => item?.name!)
        )
      );
      // }
      get().setFuelTypeList(createChecklistItemList(queryResult.fuelType.distinct, data.fuelType));
      get().setBodyTypeList(
        createChecklistItemList(
          queryResult.bodyType?.distinct?.filter((item) => {
            if (!!item.length) {
              if (item !== 'unknown') return item;
            }
          }),
          data.bodyType
        )
      );
      get().setExteriorColorList(
        createChecklistItemList(queryResult.exteriorColor?.distinct, data.exteriorColor)
      );
      get().setInteriorColorList(
        createChecklistItemList(queryResult.interiorColor?.distinct, data.interiorColor)
      );
      get().setDrivetrainList(
        createChecklistItemList(queryResult.drivetrain.distinct, data.drivetrain)
      );
      get().setTypeList(createChecklistItemList(queryResult.type.distinct, data.type));

      get().setPriceRange([
        queryResult.priceRange.min ?? 0,
        Math.ceil((queryResult.priceRange.max ?? 100000) / 10000) * 10000
      ]);
      get().setMilesRange([
        queryResult.milesRange.min ?? 0,
        Math.ceil((queryResult.milesRange.max ?? 100000) / 100) * 100
      ]);
      get().setYearRange([queryResult.yearRange.min ?? 2016, queryResult.yearRange.max ?? 2024]);

      // if (maxPriceParam) {
      //   setPriceRangeValue([queryResult.priceRange.min ?? 0, maxPriceParam]);
      // }
    } else {
      get().setApplyingFilter(undefined);
      get().setSelectedFiltersState(undefined);
      get().setSelectedSortOption(undefined);
      get().setPriceRangeValue(undefined);
      // handleFilterStateChange(undefined);

      get().setMakeList(createChecklistItemList(queryResult.allMake.nodes, contextMake));
      get().setModelList(
        createModelsChecklistItemList(
          queryResult.allModel.nodes.filter((node) => {
            if (contextMake && contextMake !== '*') {
              return node.makeName === contextMake;
            }

            return true;
          }),
          contextModel
        )
      );
      get().setLocationList(createChecklistItemList(queryResult.locations.distinct));
      // get().setTrimList(createChecklistItemList(queryResult.trim.distinct));
      get().setFuelTypeList(
        createChecklistItemList(queryResult.fuelType.distinct.filter((item) => !!item.length))
      );
      get().setDrivetrainList(
        createChecklistItemList(queryResult.drivetrain.distinct.filter((item) => !!item.length))
      );
      get().setTransmissionList(
        createChecklistItemList(queryResult.transmission.distinct.filter((item) => !!item.length))
      );
      get().setBodyTypeList(
        createChecklistItemList(
          queryResult.bodyType?.distinct?.filter((item) => {
            if (!!item.length) {
              if (item !== 'unknown') return item;
            }
          }),
          contextBodyType
        )
      );
      get().setExteriorColorList(
        createChecklistItemList(queryResult.exteriorColor.distinct.filter((item) => !!item.length))
      );
      get().setInteriorColorList(
        createChecklistItemList(queryResult.interiorColor.distinct.filter((item) => !!item.length))
      );
      get().setTypeList(
        createChecklistItemList(queryResult.type.distinct.filter((item) => !!item.length))
      );
      get().setPriceRange([
        queryResult.priceRange.min ?? 0,
        Math.ceil((queryResult.priceRange.max ?? 100000) / 10000) * 10000
      ]);

      get().setMilesRange([
        queryResult.milesRange.min ?? 0,
        Math.ceil((queryResult.milesRange.max ?? 100000) / 100) * 100
      ]);

      get().setYearRange([queryResult.yearRange.min ?? 0, queryResult.yearRange.max ?? 2024]);

      // if (maxPriceParam) {
      //   setPriceRangeValue([queryResult.priceRange.min ?? 0, maxPriceParam]);
      //   setSelectedFiltersState({ price: [queryResult.priceRange.min ?? 0, maxPriceParam] });
      // }
    }
  },

  setParamAction: (
    searchParam,
    maxPriceParam,
    contextMake,
    contextModel,
    contextBodyType,
    handleFilterStateChange,
    data,
    sort,
    clearAll
  ) => {
  console.log(111);
    // searchParam.forEach((value, key) => console.log(`${key}: ${value}`));

    // Create an array of keys
    const keysToDelete: string[] = [];
    searchParam.forEach((value, key) => keysToDelete.push(key));

    // Delete entries using the keys from the array
    keysToDelete.forEach((key) => searchParam.delete(key));

    let stringQuery: string | null = null;
    if (clearAll) {
      searchParam.forEach((value, key) => {
        searchParam.delete(key);
      });

      navigate(`/${get().carCondition}-vehicles-quincy-ma/`);

      // handleFilterStateChange(undefined);
      return;
    }
    if (sort) {
      searchParam.set('sort', sort.label.replace(/ /g, '_'));
    }

    if (contextMake !== '*' && contextMake !== undefined) {
      searchParam.set('make', contextMake);
    }
    if (contextModel !== '*' && contextModel !== undefined) {
      searchParam.set('model', contextModel);
    }

    if (contextBodyType) {
      searchParam.set('bodyType', contextBodyType);
    }
    if (data && hasAnyFilterValue(data)) {
      Object.entries(data).forEach(([key, value]) => {
        // console.log('data', key, value);
        if (key === 'price') {
          const { min, max } = value;
          min !== get().priceRange?.[0] && searchParam.set('minPrice', min);
          // : searchParam.delete('minPrice');
          max !== get().priceRange?.[1] && searchParam.set('maxPrice', max);
          // : searchParam.delete('maxPrice');
        } else if (key === 'miles') {
          const { min, max } = value;
          min !== get().milesRange?.[0]
            ? searchParam.set('minMiles', min)
            : searchParam.delete('minMiles');
          max !== get().milesRange?.[1]
            ? searchParam.set('maxMiles', max)
            : searchParam.delete('maxMiles');
        } else if (key === 'year') {
          const { min, max } = value;
          min !== get().yearRange?.[0]
            ? searchParam.set('minYear', min)
            : searchParam.delete('minYear');
          max !== get().yearRange?.[1]
            ? searchParam.set('maxYear', max)
            : searchParam.delete('maxYear');
        } else if (key === 'model') {
          if (value.filter((item: undefined) => item !== undefined).length > 0) {
            searchParam.set(
              'model',
              value.map((item: { name: any }) => item?.name!)
            );
          }
        } else if (key === 'trim') {
          if (value?.filter((item: undefined) => item !== undefined).length > 0) {
            searchParam.set(
              'trim',
              value.map((item: { name: any }) => item?.name!)
            );
          }
        } else {
          const valueString = Array.isArray(value)
            ? value.map((item) => item?.replace(/ /g, '_')).join(',')
            : value?.replace(/ /g, '_');
          if (valueString.length > 0) {
            searchParam.set(key, valueString);
          }
        }
      });
    }

    searchParam.forEach((value, key) => {
      stringQuery ? (stringQuery += `&${key}=${value}`) : (stringQuery = `${key}=${value}`);
    });

    if (contextModel !== '*' || contextMake !== '*') {
      stringQuery!
        ? // ? history.pushState({}, '', `/new-vehicles-quincy-ma/?${stringQuery}`)
          // : history.pushState({}, '', '/new-vehicles-quincy-ma/');
          navigate(`/${get().carCondition}-vehicles-quincy-ma/?${stringQuery}`)
        : navigate(`/${get().carCondition}-vehicles-quincy-ma/`);
    } else {
      stringQuery!
        ? navigate(`/${get().carCondition}-vehicles-quincy-ma/?${stringQuery}`)
        : navigate(`/${get().carCondition}-vehicles-quincy-ma/`);
      // history.pushState(undefined, '', `/new-vehicles-quincy-ma/?${stringQuery}`)
      // : history.pushState({ undefined }, '', '/new-vehicles-quincy-ma/');
    }
  },

  handleFilterStateChangeAction: async (
    contextMake,
    contextModel,
    queryResult,
    state,
    take,
    skip,
    sortOption
  ) => {
    const filters: FilterGraphQueryVariables = {
      where: {},
      whereTrim: {},
      orderBy: [],
      take: take ?? 24,
      skip: skip ?? 0
    };
console.log(1111);
    if (get().selectedFiltersState) state = get().selectedFiltersState;
    sortOption = get().selectedSortOption;

    // const stateHasContextMake = state?.make?.map((makeItem) => makeItem.includes(contextMake!));
    // const stateHasContextModel = state?.model?.map((modelItem) =>
    //   modelItem.includes(contextModel!)
    // );

    // if (contextMake && contextMake !== '*' && stateHasContextMake?.[0]) {
    //   state = {
    //     ...get().selectedFiltersState,
    //     make: state?.make ? [...state?.make, contextMake] : [contextMake]
    //   };
    // }

    // if (contextModel && contextModel !== '*' && !stateHasContextModel) {
    //   state = {
    //     ...get().selectedFiltersState,
    //     model: state?.model ? [...state?.model, contextModel] : [contextModel]
    //   };
    // }

    if (sortOption?.value === 'Highest Price') {
      filters.orderBy = [{ sellingPrice: { sort: 'desc' } }];
    }
    if (sortOption?.value === 'Lowest Price') {
      filters.orderBy = [{ sellingPrice: { sort: 'asc' } }];
    }
    if (sortOption?.value === 'Newest') {
      filters.orderBy = [{ year: { sort: 'desc' } }];
    }
    if (sortOption?.value === 'Highest Mileage') {
      filters.orderBy = [{ miles: { sort: 'desc' } }];
    }
    if (sortOption?.value === 'Lowest Mileage') {
      filters.orderBy = [{ miles: { sort: 'asc' } }];
    }

    if (state?.price) {
      filters.where.sellingPrice = {
        gte: state.price.min,
        lte: state.price.max
      };
    }

    if (state?.make?.length) {
      filters.where.make = {
        is: {
          name: {
            in: state?.make
          }
        }
      };

      filters.whereTrim.make = {
        is: {
          name: {
            in: state?.make
          }
        }
      };

      const filteredModelList = queryResult.allModel.nodes.filter((node) => {
        if (node.makeName && state?.make?.includes(node.makeName)) {
          return true;
        }

        return false;
      });
      const uniqueModels = filteredModelList.reduce(
        (
          acc: {
            readonly name: string | null;
            readonly makeName: string | null;
          }[],
          current
        ) => {
          if (!acc.some((item: { name: string | null }) => item.name === current.name)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );
      get().setModelList(
        createModelsChecklistItemList(
          uniqueModels,
          state?.model?.map((item) => item?.name!)
        )
      );
    } else {
      if (get().modelList?.length !== queryResult.allModel.nodes.length) {
        get().setModelList(
          createModelsChecklistItemList(
            queryResult.allModel.nodes,
            state?.model?.map((item) => item?.name!)
          )
        );
      }
    }

    const models = state?.model?.map((item) => item?.name!);
    if (models && models?.length > 0) {
      filters.where.model = {
        is: {
          name: {
            in: models!
          }
        }
      };

      filters.whereTrim.model = {
        is: {
          name: {
            in: models!
          }
        }
      };
    } else if (contextModel && contextModel !== '*') {
      filters.whereTrim.model = {
        is: {
          name: {
            in: [contextModel]
          }
        }
      };
    }

    if (state?.location?.length) {
      filters.where.dealerCity = {
        in: state?.location
      };
    }
    const trims = state?.trim?.map((item) => item?.name!).filter((item) => item !== undefined);
    if (trims && trims.length > 0) {
      filters.where.trim = {
        in: trims
      };
    }

    if (state?.miles) {
      filters.where.miles = {
        gte: state?.miles.min,
        lte: state?.miles.max
      };
    }

    if (state?.year) {
      filters.where.year = {
        gte: state?.year.min,
        lte: state?.year.max
      };
    }

    if (state?.fuelType?.length) {
      filters.where.fuelType = {
        in: state?.fuelType
      };
    }
    if (state?.bodyType?.length) {
      filters.where.bodyType = {
        in: state?.bodyType
      };
    }

    if (state?.transmission?.length) {
      filters.where.transmission = {
        in: state?.transmission
      };
    }

    if (state?.drivetrain?.length) {
      filters.where.drivetrain = {
        in: state?.drivetrain
      };
    }

    if (state?.exteriorColor?.length) {
      filters.where.extColorGeneric = {
        in: state?.exteriorColor
      };
    }

    if (state?.interiorColor?.length) {
      filters.where.intColorGeneric = {
        in: state?.interiorColor
      };
    }
    // if (state?.type?.length) {
    filters.where.type = {
      in: [get().carCondition === 'new' ? 'New' : 'Used']
    };
    // }

    filters.where.dealerNetwork = {
      equals: 'quirk'
    };
    filters.whereTrim.dealerNetwork = {
      equals: 'quirk'
    };

    // console.log(`Applying filters: `, JSON.stringify(filters, null, 2));

    if (!filters.orderBy?.length) {
      filters.orderBy = [{ dateInStock: 'desc' }, { updatedAt: 'desc' }];
    }

    get().setApplyingFilter(filters);
    // filterVehicles({ variables: filters });
  }
}));
