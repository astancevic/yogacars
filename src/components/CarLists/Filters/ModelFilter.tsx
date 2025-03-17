import React, { useCallback, useMemo, useState } from 'react';
import FilterWrapper, { type FilterWrapperProps } from './FilterWrapper';
import Checkbox from './CheckBox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useYogaCarStore } from '@/store/yogaCarStore';

export interface ChecklistItem {
    label: string;
    value: string;
    checked: boolean;
    parent?: string;
}

interface ModelFilterProps extends FilterWrapperProps {
    items: ChecklistItem[];
    setItems?: (newValue: ChecklistItem[] | undefined) => void;
    onChange: (selections: { name: string; parent?: string }[]) => void;
    message?: string;
    showItem: boolean;
}

export default function ModelFilter(props: ModelFilterProps) {
    const [filtersVisible, setFiltersVisible] = useState(!!props.isExpanded);

    // Get selected make filters from the store
    const selectedFiltersState = useYogaCarStore((state) => state.selectedFiltersState);
    const selectedMakes = selectedFiltersState?.make || [];

    // Handle checkbox selection change
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

            // Update parent component with the new selections
            props.onChange(Array(...new Set(updatedList)));

            // Update checked state in the items array
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

    // Group models by manufacturer and filter by selected makes
    const groupedModels = useMemo(() => {
        // Filter items based on selected makes if any
        const filteredItems = selectedMakes.length > 0
            ? props.items.filter(item => item.parent && selectedMakes.includes(item.parent))
            : props.items;

        // Group items by parent (make)
        const groups = filteredItems.reduce((acc, item) => {
            if (!item.parent) return acc;

            if (!acc[item.parent]) {
                acc[item.parent] = [];
            }

            // Only add if not already in the group (avoid duplicates)
            const exists = acc[item.parent].some(existingItem => existingItem.value === item.value);
            if (!exists) {
                acc[item.parent].push(item);
            }

            return acc;
        }, {} as Record<string, ChecklistItem[]>);

        // Sort models within each make alphabetically
        Object.keys(groups).forEach(make => {
            groups[make].sort((a, b) => a.label.localeCompare(b.label));
        });

        // Sort makes alphabetically
        return Object.keys(groups)
            .sort()
            .reduce((acc, key) => {
                acc[key] = groups[key];
                return acc;
            }, {} as Record<string, ChecklistItem[]>);
    }, [props.items, selectedMakes]);

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
                    <div className={`${filtersVisible ? 'flex' : 'hidden'} max-h-48 min-h-8 flex-col`}>
                        {Object.keys(groupedModels).length > 0 ? (
                            // Display models grouped by make
                            Object.entries(groupedModels).map(([make, models]) => (
                                <div key={make} className="mb-2">
                                    <div className="font-medium text-gray-700 text-sm mb-1">{make}</div>
                                    <div className="ml-2">
                                        {models.map((item, index) => (
                                            <Checkbox
                                                key={item.label + index.toString()}
                                                className="my-1.5 w-11/12 cursor-pointer text-base leading-8 md:text-sm md:leading-5"
                                                labelClass="text-black/85 truncate"
                                                label={item.label}
                                                value={item.value}
                                                checked={item.checked}
                                                onChange={(isChecked) => handleSelectionChange(item, isChecked)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>
                                {selectedMakes.length > 0
                                    ? 'No models available for selected makes'
                                    : `No ${props.title} to show`}
                            </p>
                        )}
                    </div>
                )}
            </ScrollArea>
        </FilterWrapper>
    );
}