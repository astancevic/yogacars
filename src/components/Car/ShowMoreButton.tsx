// import React from 'react';
// import { FilterState } from './SideBarFilters';
// import { APIVehicle } from '../../lib/types';
// import { useYogaCarStore } from '../../store/yogaCarStore';
// import { hasAnyFilterValue } from '@/lib/utils';
// import { BaseSelectOption } from '../FormControls/Dropdown';
//
// interface ShowMoreButtonProps {
//   handleFilterStateChange: (
//     state?: FilterState | undefined,
//     take?: number | undefined,
//     skip?: number | undefined,
//     sortOption?: BaseSelectOption<string> | undefined
//   ) => void;
//
//   vehicleList: APIVehicle[];
//
//   contextMake: string | undefined;
//   contextModel: string | undefined;
//   bodyType: string | undefined;
//   isFetching: boolean;
//   setIsLoadMore: React.Dispatch<React.SetStateAction<boolean>>;
// }
// export default function ShowMoreButton({
//   handleFilterStateChange,
//   vehicleList,
//   contextMake,
//   contextModel,
//   bodyType,
//   setIsLoadMore,
//   isFetching
// }: ShowMoreButtonProps) {
//   const setSelectedFiltersState = useYogaCarStore((state) => state.setSelectedFiltersState);
//   const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
//
//   return (
//     <div className="mt-16 flex w-full items-center justify-center 3xl:h-0">
//       <button
//         className="rounded bg-primary px-7 py-2 text-xl font-semibold text-white"
//         onClick={() => {
//           if (!hasAnyFilterValue(selectedFiltersState!)) {
//             const newState: FilterState = {
//               make: [],
//               model: [],
//               bodyType: []
//             };
//             contextMake && contextMake !== '*' && newState.make?.push(contextMake);
//             contextModel &&
//               contextModel !== '*' &&
//               newState.model?.push({ name: contextModel, parent: contextMake });
//             bodyType !== undefined && newState.bodyType?.push(bodyType);
//
//             setSelectedFiltersState(newState);
//           }
//           setIsLoadMore(true);
//           handleFilterStateChange(undefined, vehicleList.length + 24, 0);
//         }}
//       >
//         Show More Cars
//       </button>
//     </div>
//   );
// }
