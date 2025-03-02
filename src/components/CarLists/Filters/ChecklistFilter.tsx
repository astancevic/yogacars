import React, { useCallback, useMemo, useState } from 'react';
import FilterWrapper, {type FilterWrapperProps } from './FilterWrapper';
import Checkbox from './CheckBox';
import { ScrollArea } from 'components/ui/scroll-area.tsx';

export interface ChecklistItem {
  label: string;
  value: string;
  checked: boolean;
  parent?: string;
}

interface ChecklistFilterProps extends FilterWrapperProps {
  items: ChecklistItem[];
  // setItems?: React.Dispatch<React.SetStateAction<ChecklistItem[] | undefined>>;
  setItems?: (newValue: ChecklistItem[] | undefined) => void;
  onChange: (selections: string[]) => void;
  message?: string;
  showItem: boolean;
}

export default function ChecklistFilter(props: ChecklistFilterProps) {
  // const [checkedItems, setCheckedItems] = useState<string[]>(
  //   props.items?.filter((e) => e.checked).map((e) => e.value) ?? []
  // );

  // useEffect(() => {
  //   setCheckedItems(props.items?.filter((e) => e.checked).map((e) => e.value) ?? []);
  // }, [props.items]);

  // console.log('checkedItems', checkedItems);

  const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);

  const handleSelectionChange = useCallback(
    (item: ChecklistItem, checked: boolean) => {
      const checkedItems = props.items?.filter((e) => e.checked).map((e) => e.value) ?? [];
      let updatedList = [...checkedItems!];

      if (checked) {
        updatedList = [...checkedItems!, item.value];
      } else {
        updatedList.splice(checkedItems!.indexOf(item.value), 1);
      }

      // setCheckedItems(Array(...new Set(updatedList)));
      props.onChange(Array(...new Set(updatedList)));

      const updatedItems = props?.items?.map((prevItem) => {
        if (prevItem.value === item.value) {
          return { ...prevItem, checked: checked };
        } else {
          return { ...prevItem };
        }
      });

      props.setItems && props.setItems(updatedItems);
    },
    [props.items, props.onChange, props.setItems]
  );

  const sortedItems = useMemo(() => {
    // if (props?.items?.some((item) => item.checked)) {
    //   return props.items.sort((a, b) => {
    //     if (a.checked && !b.checked) {
    //       return -1;
    //     } else if (!a.checked && b.checked) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }
    //   });
    // } else {
    //   return props?.items?.sort((a, b) => a.label.localeCompare(b.label));
    // }
    const uniqueValues = props.items?.reduce((acc: ChecklistItem[], current) => {
      if (!acc.some((item) => item.value === current.value)) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueValues?.sort((a, b) => a.label.localeCompare(b.label));
  }, [props.items]);

  return (
    <FilterWrapper
      title={props.title}
      className={`checklist-filter ${props.className}`}
      isExpanded={props.isExpanded}
      onExpandedChange={(value) => setFiltersVisible(value)}
    >
      <ScrollArea type="always">
        {!props.showItem ? (
          <p>{props.message}</p>
        ) : (
          <div className={`${filtersVisible ? 'flex' : 'hidden'}  max-h-48 min-h-8 flex-col`}>
            {sortedItems?.length > 0
              ? sortedItems.map((item, index) => (
                  <Checkbox
                    key={item.label + index.toString()}
                    className="my-1.5 w-11/12 cursor-pointer text-base leading-8 md:text-sm md:leading-5"
                    labelClass="text-black/85 truncate"
                    label={item.label}
                    value={item.value}
                    checked={item.checked}
                    onChange={(isChecked) => handleSelectionChange(item, isChecked)}
                  />
                ))
              : `No ${props.title} to show`}
          </div>
        )}
      </ScrollArea>
    </FilterWrapper>
  );
}

// interface ChecklistItemProps extends ChecklistItem {
//   labelClass?: string;
//   checkboxClass?: string;

//   onChange?: (checked: boolean) => void;
// }

// function Checkbox(props: StylableProp<ChecklistItemProps>) {
//   const [isChecked, setIsChecked] = useState<boolean>();

//   useEffect(() => {
//     setIsChecked(props.checked);
//   }, [props.checked]);

//   const handleCheck = () => {
//     const newValue = !isChecked;

//     setIsChecked(newValue);

//     props.onChange?.(newValue);
//   };

//   return (
//     <label className={`flex items-center gap-1 ${props.className}`}>
//       <input
//         className={`rounded border-black/85 text-primary focus:outline-0 focus:ring-0 active:outline-none active:ring-0 ${props.checkboxClass}`}
//         type={'checkbox'}
//         value={props.value}
//         checked={isChecked}
//         onChange={handleCheck}
//       />{' '}
//       <div title={props.label} className={`mx-0.5 align-middle ${props.labelClass}`}>
//         {props.label}
//       </div>
//     </label>
//   );
// }

// function extractSelectedItems(items: ChecklistItem[]) {
//   return items.reduce<string[]>((list, item) => {
//     if (item.checked) {
//       list.push(item.value);
//     }

//     return list;
//   }, []);
// }

// const DATA = [
//   {
//     label: 'Ford',
//     value: 'Ford',
//     checked: false
//   },
//   {
//     label: 'KIA',
//     value: 'KIA',
//     checked: false
//   },
//   {
//     label: 'Haval',
//     value: 'Haval',
//     checked: false
//   },
//   {
//     label: 'Toyota',
//     value: 'Toyota',
//     checked: false
//   },
//   {
//     label: 'GMC',
//     value: 'GMC',
//     checked: false
//   }
// ];
