import Button from '../../../components/Button/Button';
import React, { useEffect } from 'react';
import { useLocation } from '@reach/router';
import { useYogaCarStore } from '../../../store/yogaCarStore';
import { navigate } from 'gatsby';

export default function ConditionFilter() {
  const location = useLocation();

  const carCondition = useYogaCarStore((state) => state.carCondition);
  const setCarCondition = useYogaCarStore((state) => state.setCarCondition);
  const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
  const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);

  const toggleUrl = (type: 'new' | 'used') => {
    // const newPath = location.pathname.replace(/\/(new|used)/, `/${type}`);
    setYearRangeValue(undefined);
    setMilesRangeValue(undefined);
    navigate(`/${type}-vehicles-quincy-ma/`);
  };

  useEffect(() => {
    location.pathname.includes('new') ? setCarCondition('new') : setCarCondition('used');
  }, []);

  return (
    <div className="m-2 flex ">
      <button
        // type={carCondition === 'new' ? 'primary' : 'secondary'}
        className={`w-full  rounded-l-lg border-y  border-l py-2 ${carCondition === 'new' ? 'border-primary bg-primary text-white' : 'bg-white text-black'}`}
        onClick={() => {
          setCarCondition('new');
          toggleUrl('new');
        }}
      >
        New
      </button>
      <button
        // type={carCondition === 'used' ? 'primary' : 'secondary'}
        className={`w-full  rounded-r-lg border-y  border-r py-2 ${carCondition === 'used' ? 'border-primary bg-primary text-white' : 'bg-white text-black'}`}
        onClick={() => {
          setCarCondition('used');
          toggleUrl('used');
        }}
      >
        Used
      </button>
    </div>
  );
}
