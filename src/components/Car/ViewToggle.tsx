import { useYogaCarStore } from '../../store/yogaCarStore';
import { LayoutGridIcon, Rows2Icon } from 'lucide-react';
import React from 'react';

export default function ViewToggle() {
  // const { selectedView, setSelectedView } = useFilterContext();
  const selectedView = useYogaCarStore((state) => state.selectedView);
  const setSelectedView = useYogaCarStore((state) => state.setSelectedView);
  return (
    <div className="hidden items-center gap-1 lg:flex ">
      <p className="mr-1 text-base md:mr-3">View</p>

      <LayoutGridIcon
        className={`${
          selectedView === 'grid' ? 'fill-primary text-primary' : 'fill-[#D9D9D9] text-[#D9D9D9]'
        }  cursor-pointer`}
        onClick={() => setSelectedView('grid')}
      />
      <Rows2Icon
        className={`${
          selectedView === 'list'
            ? 'fill-primary text-pure-gray-400'
            : 'fill-gray-500/50 text-pure-gray-400'
        } cursor-pointer`}
        onClick={() => setSelectedView('list')}
      />
    </div>
  );
}
