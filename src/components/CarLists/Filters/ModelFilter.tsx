import React, { useCallback, useMemo, useState } from 'react';
import FilterWrapper, { FilterWrapperProps } from './FilterWrapper';
import Checkbox from './CheckBox';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  onChange: (selections: { name: string; parent?: string }[]) => void;
  message?: string;
  showItem: boolean;
}

export default function ModelFilter(props: ChecklistFilterProps) {
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
      const checkedItems =
        props.items
          ?.filter((e) => e.checked)
          .map((e) => {
            return { name: e.value, parent: e.parent };
          }) ?? [];
      let updatedList = [...checkedItems!];

      if (checked) {
        updatedList = [...checkedItems!, { name: item.value, parent: item.parent }];
      } else {
        updatedList.splice(
          checkedItems!.findIndex(
            (findingItem) => findingItem.name === item.value && findingItem.parent === item.parent
          ),
          1
        );
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
