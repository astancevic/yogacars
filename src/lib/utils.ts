import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {ListLikeItem, filterKeys, modelListLikeItem, trimsQueryResponse} from './types';
import type {ChecklistItem} from '../components/CarLists/Filters/ChecklistFilter';
import type {FilterState} from '@/components/Car/SideBarFilters';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function createChecklistItemList(
    data: readonly ListLikeItem[] | readonly string[],
    preselected?: string | string[]
): ChecklistItem[] {
  let items: ListLikeItem[] = [];

  if (data.length && typeof data[0] === 'string') {
    items = data.map((item) => ({ name: item })) as ListLikeItem[];
  } else {
    items = [...data] as ListLikeItem[];
  }

  return items.reduce<ChecklistItem[]>((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected)
            ? preselected.includes(item.name)
            : item.name === preselected
      });
    }
    return list;
  }, []);
}
export function createModelsChecklistItemList(
    data: readonly modelListLikeItem[],
    preselected?: string | string[]
): ChecklistItem[] {
  // let items: ListLikeItem[] = [];

  // if (data.length && typeof data[0] === 'string') {
  //   items = data.map((item) => ({ name: item, makeName: })) as ListLikeItem[];
  // } else {
  //   items = [...data] as ListLikeItem[];
  // }

  return data.reduce<ChecklistItem[]>((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected)
            ? preselected.includes(item.name)
            : item.name === preselected,
        parent: item.makeName as string
      });
    }
    return list;
  }, []);
}

export function createTrimChecklistItemList(
    data: trimsQueryResponse,
    preselected?: string | string[]
): ChecklistItem[] {
  // let items: ListLikeItem[] = [];

  // if (data.length && typeof data[0] === 'string') {
  //   items = data.map((item) => ({ name: item, makeName: })) as ListLikeItem[];
  // } else {
  //   items = [...data] as ListLikeItem[];
  // }

  return data?.trim?.reduce<ChecklistItem[]>((list, item) => {
    if (item?.name) {
      list.push({
        label: item.name,
        value: item.name,
        checked: Array.isArray(preselected)
            ? preselected.includes(item.name)
            : item.name === preselected,
        parent: item.model.name as string
      });
    }
    return list;
  }, []);
}

export function getSearchParam(name: string, searchParam: URLSearchParams) {
  return (
      searchParam
          .get(name)
          ?.split(',')
          // .map((item) => item.replace(/ /g, '+'))
          .map((item) => item.replace(/_/g, ' '))
  );
}

export function arrayEquals(a: (string | null)[], b: (string | null)[]) {
  return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
  );
}

export function hasAnyFilterValue(filterState: FilterState): boolean {
  for (const key in filterState) {
    const value = filterState[key as filterKeys];

    if (Array.isArray(value)) {
      if (value.length > 0) {
        return true;
      }
    } else if (key === 'price' || key === 'miles' || key === 'year') {
      if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
        return true;
      }
    } else if (value !== undefined) {
      return true;
    }
  }

  return false;
}