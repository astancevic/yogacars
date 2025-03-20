import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../Button/Button';
import { Dropdown, type BaseSelectOption } from '../FormControls/Dropdown';
import { formatCurrency } from '../CarLists/formatCurrency';

interface Model {
  id: number;
  name: string;
  manufacturer: string;
}

interface Make {
  id: number;
  name: string;
}

export default function HeroSection() {
  // State management
  const [typeList, setTypeList] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [makeList, setMakeList] = useState<Make[]>([]);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [loading, setLoading] = useState({
    types: false,
    makes: false,
    models: false,
  });

  // Default "All" options
  const allMakesOption: BaseSelectOption<number> = { id: -1, value: -1, label: 'All Makes' };
  const allModelsOption: BaseSelectOption<number> = { id: -1, value: -1, label: 'All Models' };
  const conditionsDefaultOption: BaseSelectOption<string> = { id: 'Conditions', value: 'new', label: 'Conditions' };

  // Selection state - initialize with defaults
  const [selectedType, setSelectedType] = useState<BaseSelectOption<string>>(conditionsDefaultOption);
  const [selectedMake, setSelectedMake] = useState<BaseSelectOption<number>>(allMakesOption);
  const [selectedModel, setSelectedModel] = useState<BaseSelectOption<number>>(allModelsOption);
  const [selectedPrice, setSelectedPrice] = useState<BaseSelectOption<number> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchInitialData() {
      setLoading(prev => ({ ...prev, types: true }));
      try {
        // Parallel fetch for initial data
        const [typesResponse, maxPriceResponse] = await Promise.all([
          fetch('/api/vehicletypes', { signal }),
          fetch('/api/max-min-price', { signal })
        ]);

        if (!typesResponse.ok || !maxPriceResponse.ok) {
          throw new Error('Network response was not ok');
        }

        // Log the response body to debug
        const typesText = await typesResponse.text();  // Get the raw text
        const maxPriceText = await maxPriceResponse.text();  // Get the raw text

        // Log to check for any issues with empty or malformed responses
        console.log('typesResponse body:', typesText);
        console.log('maxPriceResponse body:', maxPriceText);

        // Only parse if response body is not empty
        const types = typesText ? JSON.parse(typesText) : [];
        const maxPriceData = maxPriceText ? JSON.parse(maxPriceText) : {};

        setTypeList(types.filter((type: string) => type.toLowerCase() !== 'other'));
        setMaxPrice(maxPriceData.maxPrice || 100000);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching initial data:', error);
        }
      } finally {
        setLoading(prev => ({ ...prev, types: false }));
      }
    }

    fetchInitialData();

    // Cleanup
    return () => controller.abort();
  }, []);

  // Fetch makes when selected type changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchMakes() {
      setLoading(prev => ({ ...prev, makes: true }));
      try {
        let url = '/api/makes';
        if (selectedType && selectedType.value !== 'new') url += `?type=${encodeURIComponent(selectedType.value)}`;

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Network response was not ok');

        const makes: Make[] = await response.json();
        setMakeList(makes);
      } catch (error : any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching makes:', error);
        }
      } finally {
        setLoading(prev => ({ ...prev, makes: false }));
      }
    }

    fetchMakes();

    // Cleanup
    return () => controller.abort();
  }, [selectedType]);

  // Fetch models when selected make or type changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchModels() {
      // Only fetch models if we have a make selected and it's not "All Makes"
      if (!selectedMake || selectedMake.value === -1) {
        setModelList([]);
        return;
      }

      setLoading(prev => ({ ...prev, models: true }));
      try {
        let url = `/api/models?manufacturerId=${selectedMake.value}`;
        if (selectedType && selectedType.value !== 'new') url += `&type=${encodeURIComponent(selectedType.value)}`;

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Network response was not ok');

        const models: Model[] = await response.json();
        setModelList(models);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching models:', error);
        }
      } finally {
        setLoading(prev => ({ ...prev, models: false }));
      }
    }

    fetchModels();

    // Cleanup
    return () => controller.abort();
  }, [selectedMake, selectedType]);

  // Memoized price options to prevent unnecessary recalculations
  const priceList = useMemo(() => {
    const list: BaseSelectOption<number>[] = [];

    // Generate price steps with fewer iterations for better performance
    const step = maxPrice <= 50000 ? 5000 : 10000;
    for (let value = step; value <= maxPrice; value += step) {
      list.push({ id: value, value, label: formatCurrency(value) });
    }

    return list;
  }, [maxPrice]);

  // Memoized dropdown options
  const typeOptions = useMemo(() => {
    // If Conditions is currently selected, include it and the regular options
    if (selectedType.id === 'Conditions') {
      const options: BaseSelectOption<string>[] = [conditionsDefaultOption];

      // Add the rest of the type options
      typeList.forEach(value => {
        options.push({ id: value, value, label: value });
      });

      return options;
    } else {
      // If Conditions is not selected, only show the regular options
      return typeList.map(value => ({ id: value, value, label: value }));
    }
  }, [typeList, conditionsDefaultOption, selectedType]);

  const makeOptions = useMemo(() => {
    // Start with the All Makes option
    const options: BaseSelectOption<number>[] = [allMakesOption];

    // Add the rest of the make options
    makeList.forEach(make => {
      options.push({ id: make.id, value: make.id, label: make.name });
    });

    return options;
  }, [makeList, allMakesOption]);

  const modelOptions = useMemo(() => {
    // Start with the All Models option
    const options: BaseSelectOption<number>[] = [allModelsOption];

    // Add model options only if we have a specific make selected
    if (selectedMake && selectedMake.value !== -1) {
      modelList.forEach(model => {
        options.push({ id: model.id, value: model.id, label: model.name });
      });
    }

    return options;
  }, [modelList, selectedMake, allModelsOption]);

  // Callback handlers
  const onSelectTypeChange = useCallback((selection: BaseSelectOption<string>) => {
    setSelectedType(selection);
    // Reset make and model when type changes
    setSelectedMake(allMakesOption);
    setSelectedModel(allModelsOption);
  }, [allMakesOption, allModelsOption]);

  const onSelectMakeChange = useCallback((selection: BaseSelectOption<number>) => {
    setSelectedMake(selection);
    setSelectedModel(allModelsOption);
  }, [allModelsOption]);

  const onSelectModelChange = useCallback((selection: BaseSelectOption<number>) => {
    setSelectedModel(selection);
  }, []);

  const onSelectPriceChange = useCallback((selection: BaseSelectOption<number>) => {
    setSelectedPrice(selection);
  }, []);

  const handleShopCarsClick = useCallback(() => {
    // Build the search URL with all selected filters
    const params = new URLSearchParams();

    if (selectedPrice) params.append('maxPrice', selectedPrice.value.toString());

    // Only add makeId if a specific make is selected (not "All Makes")
    if (selectedMake && selectedMake.value !== -1) {
      params.append('makeId', selectedMake.value.toString());

      // Only add modelId if a specific model is selected (not "All Models")
      if (selectedModel && selectedModel.value !== -1) {
        params.append('modelId', selectedModel.value.toString());
      }
    }

    // Determine the vehicle type segment of the URL
    // Always use "new" if the selected type is "Conditions"
    // Otherwise use the selectedType value
    const typeUrlSegment = selectedType.id === 'Conditions'
        ? 'new'
        : selectedType.value.toLowerCase();

    const url = `/${typeUrlSegment}-vehicles-quincy-ma/?${params.toString()}`;

    window.location.href = url;
  }, [selectedMake, selectedModel, selectedPrice, selectedType]);

  return (
      <div className="h-screen w-full bg-black/40">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 pt-5 xl:h-full xl:w-3/5">
          <h1 className="text-center text-2xl font-semibold text-white sm:text-4xl lg:text-6xl">
            Find Your <span className="text-primary">Perfect</span> Car
          </h1>
          <div className="mx-auto flex w-72 flex-col justify-center gap-6 lg:w-[840px] lg:flex-row">
            <Dropdown
                className="h-14 flex-1"
                options={typeOptions}
                value={selectedType.label}
                defaultValue={conditionsDefaultOption}
                placeholder={loading.types ? "Loading..." : "Condition"}
                onChange={onSelectTypeChange}
            />
            <Dropdown
                className="h-14 flex-1"
                options={makeOptions}
                value={selectedMake.label}
                defaultValue={allMakesOption}
                placeholder={loading.makes ? "Loading..." : "Make"}
                onChange={onSelectMakeChange}
            />
            <Dropdown
                className="h-14 flex-1"
                options={modelOptions}
                value={selectedModel.label}
                defaultValue={allModelsOption}
                placeholder={loading.models ? "Loading..." : "Model"}
                onChange={onSelectModelChange}
                listBoxClassName="min-w-[200px]"
            />
            <Dropdown
                className="h-14 flex-1"
                options={priceList}
                value={selectedPrice?.label}
                placeholder="Max Price"
                onChange={onSelectPriceChange}
            />
          </div>
          <div className={`text-center `}>
            <Button onClick={handleShopCarsClick}>
              <span className="text-2xl">Shop Cars</span>
            </Button>
          </div>
        </div>
      </div>
  );
}