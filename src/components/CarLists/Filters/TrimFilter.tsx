// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import FilterWrapper, { FilterWrapperProps } from './FilterWrapper';
// import { useQuery } from '@tanstack/react-query';
// import { apiUrl } from '@/components/Car/CarPage';
// import { TRIM } from '../../../lib/query/trimQuery';
// import { useYogaCarStore } from '../../../store/yogaCarStore';
// import request from 'graphql-request';
// import { createChecklistItemList, createTrimChecklistItemList, getSearchParam } from '@/lib/utils';
// import type {
//     EqualOperator,
//     IsNameEqualsOperator,
//     ListLikeItem,
//     trimsQueryResponse
// } from '../../../lib/types';
// import Checkbox from './CheckBox';
// import { ScrollArea } from '@/components/ui/scroll-area';
//
// export interface ChecklistItem {
//   label: string;
//   value: string;
//   checked: boolean;
//   parent?: string;
// }
//
// interface ChecklistFilterProps extends FilterWrapperProps {
//   items: ChecklistItem[];
//   // setItems?: React.Dispatch<React.SetStateAction<ChecklistItem[] | undefined>>;
//   setItems?: (newValue: ChecklistItem[] | undefined) => void;
//   onChange: (selections: { name: string; parent?: string }[]) => void;
//   message?: string;
//   showItem: boolean;
//   contextModel: string | undefined;
// }
//
// export default function TrimFilter(props: ChecklistFilterProps) {
//   const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);
//   const applyingFilter = useYogaCarStore((state) => state.applyingFilter);
//   const setTrimList = useYogaCarStore((state) => state.setTrimList);
//   const trimList = useYogaCarStore((state) => state.trimList);
//   const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
//   const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
//   const carCondition = useYogaCarStore((state) => state.carCondition);
//
//   const trimVariables: {
//     where: {
//       make?: IsNameEqualsOperator | undefined;
//       model?: IsNameEqualsOperator | undefined;
//       type?: EqualOperator | undefined;
//       dealerNetwork?: EqualOperator | undefined;
//     };
//   } = { where: {} };
//
//   if (
//     applyingFilter &&
//     applyingFilter.whereTrim &&
//     applyingFilter.whereTrim.model?.is.name.in.length! > 0
//   ) {
//     trimVariables.where = {
//       ...applyingFilter.whereTrim,
//       type: { equals: carCondition === 'new' ? 'New' : 'Used' }
//     };
//   } else {
//     trimVariables.where = {
//       model: { is: { name: { in: [props.contextModel!] } } },
//       type: { equals: carCondition === 'new' ? 'New' : 'Used' },
//       dealerNetwork: { equals: 'quirk' }
//     };
//   }
//
//   const { data, error, isFetching } = useQuery<trimsQueryResponse>({
//     queryKey: ['trimList', { ...applyingFilter?.whereTrim }],
//     enabled: !!selectedFiltersState?.model || props.contextModel !== '*',
//     queryFn: async () => request(apiUrl, TRIM, trimVariables),
//     // initialData: () => initialData!,
//     refetchOnWindowFocus: false
//   });
//
//   // const locationPath = useLocation();
//   // const searchParam = new URLSearchParams(locationPath.search);
//   // const trimParam = getSearchParam('trim', searchParam);
//
//   useEffect(() => {
//     if (data?.trim && data.trim?.length > 0) {
//       const prevTrim = data?.trim?.flatMap((item) => {
//         return selectedFiltersState?.trim === undefined
//           ? []
//           : selectedFiltersState.trim
//               .map((prevItem) => {
//                 if (prevItem.name === item.name) {
//                   return { name: item.name, parent: item.model.name };
//                 }
//                 return undefined;
//               })
//               .filter((item): item is { name: string; parent: string } => item !== undefined);
//       });
//
//       data.trim &&
//         setTrimList(
//           createTrimChecklistItemList(
//             data,
//             prevTrim?.map((item) => item?.name)
//           )
//         );
//       const newState = { ...selectedFiltersState };
//       newState.trim = prevTrim;
//       setSelectedFiltersState(newState);
//     }
//   }, [data?.trim]);
//
//   const handleSelectionChange = useCallback(
//     (item: ChecklistItem, checked: boolean) => {
//       const checkedItems =
//         props.items
//           ?.filter((e) => e.checked)
//           .map((e) => {
//             return { name: e.value, parent: e.parent };
//           }) ?? [];
//       let updatedList = [...checkedItems!];
//
//       if (checked) {
//         updatedList = [...checkedItems!, { name: item.value, parent: item.parent }];
//       } else {
//         // updatedList.splice(checkedItems!.indexOf({ name: item.value, parent: item.parent }), 1);
//         updatedList.splice(
//           checkedItems!.findIndex(
//             (findingItem) => findingItem.name === item.value && findingItem.parent === item.parent
//           ),
//           1
//         );
//       }
//
//       // setCheckedItems(Array(...new Set(updatedList)));
//       props.onChange(Array(...new Set(updatedList)));
//
//       const updatedItems = props?.items?.map((prevItem) => {
//         if (prevItem.value === item.value) {
//           return { ...prevItem, checked: checked };
//         } else {
//           return { ...prevItem };
//         }
//       });
//
//       props.setItems && props.setItems(updatedItems);
//     },
//     [props.items, props.onChange, props.setItems]
//   );
//
//   const sortedItems = useMemo(() => {
//     return trimList?.sort((a, b) => a.label.localeCompare(b.label));
//   }, [trimList]);
//
//   return (
//     <FilterWrapper
//       title={props.title}
//       className={`checklist-filter ${props.className}`}
//       isExpanded={props.isExpanded}
//       onExpandedChange={(value) => setFiltersVisible(value)}
//     >
//       <ScrollArea type="always">
//         {(selectedFiltersState?.model && selectedFiltersState?.model.length > 0) ||
//         (props.contextModel && props.contextModel !== '*') ? (
//           error ? (
//             <div>
//               <p>Something went wrong!</p>
//               <p className="text-red-400">{error.message}</p>
//             </div>
//           ) : isFetching ? (
//             <p>Loading...</p>
//           ) : (
//             <div className={`${filtersVisible ? 'flex' : 'hidden'} max-h-48 min-h-8 flex-col `}>
//               {sortedItems && sortedItems?.length > 0
//                 ? sortedItems.map((item) => (
//                     <Checkbox
//                       key={item.value}
//                       className="my-1.5 w-11/12 cursor-pointer text-base leading-8 md:text-sm md:leading-5"
//                       labelClass="text-black/85 truncate"
//                       label={item.label}
//                       value={item.value}
//                       checked={item.checked}
//                       onChange={(isChecked) => handleSelectionChange(item, isChecked)}
//                     />
//                   ))
//                 : `No ${props.title} Found`}
//             </div>
//           )
//         ) : (
//           <p>Please select a Model</p>
//         )}
//       </ScrollArea>
//     </FilterWrapper>
//   );
// }
