import React, { useMemo, useState, useEffect } from 'react';
import PopularMakesCards from './PopularMakesCards';
import LineBarIcon from "/assets/images/svg/line-bar-icon.svg?url";

// Define types based on the expected data structure
interface Vehicle {
  vin: string;
  body: string;
  dateInStock?: string;
  invoice?: number;
  year: number;
  type: string;
  miles: number;
  dealerState: string;
  dealerCity: string;
  trim: string;
  heroImageUrl: string;
  make?: {
    name: string;
  };
  model?: {
    name: string;
  };
}

interface Model {
  name: string;
  vehicles: Vehicle[];
}

interface Make {
  name: string;
  models: Model[];
}

function PopularMakes() {
  // State to store fetched makes
  const [makesData, setMakesData] = useState<Make[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for selected make
  const [selectedMake, setSelectedMake] = useState<string | undefined>(undefined);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setLoading(true);
        const response = await fetch('/api/popular-makes');

        if (!response.ok) {
          throw new Error('Failed to fetch popular makes');
        }

        const data = await response.json();
        setMakesData(data);

        // Set the initial selected make
        if (data.length > 0) {
          setSelectedMake(data[0].name);
        }
      } catch (err) {
        console.error('Error fetching popular makes:', err);
        setError('Failed to load popular makes');
      } finally {
        setLoading(false);
      }
    }

    fetchMakes();
  }, []);

  // Memoized list of models for the selected make
  const modelsList = useMemo(() => {
    return makesData.find((make) => make.name === selectedMake)?.models ?? [];

  }, [selectedMake, makesData]);
  // Show loading state
  if (loading) {
    return <div className="text-center py-8">Loading popular makes...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
      <>
        <div className="mx-auto flex w-full flex-col items-center justify-between md:flex-row md:px-10 lg:pl-10 lg:pr-20">
          <div className="w-full md:w-fit">
            <h2 className="px-6 pb-0 text-left text-3xl font-semibold md:px-0 md:pb-5 lg:text-[40px]">
              Popular Makes
            </h2>
            <img src={LineBarIcon} className="hidden md:block" alt="line-bar"/>

          </div>
          <div
              className="mt-4 flex gap-2 overflow-auto md:mt-0 md:justify-end md:gap-5"
              role="group"
          >
            {makesData.map((make) => (
                <button
                    key={make.name}
                    type="button"
                    className={`min-w-16 rounded border border-primary bg-white px-0 py-3 text-center text-xs font-normal outline-none hover:bg-[#00b54321] hover:bg-gray-100 focus:z-10 focus:bg-[#00b54321] md:w-24 md:text-sm lg:text-base ${
                        selectedMake === make.name ? 'bg-[#00b54321] text-primary' : ''
                    } active:bg-[#00b54321]`}
                    onClick={() => setSelectedMake(make.name)}
                >
                  {make.name}
                </button>
            ))}
          </div>
        </div>
        <PopularMakesCards modelsList={modelsList} />
      </>
  );
}

export default PopularMakes;