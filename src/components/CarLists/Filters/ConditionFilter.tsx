import Button from '../../../components/Button/Button';
import React, { useEffect } from 'react';
import { useYogaCarStore } from '../../../store/yogaCarStore';
import { navigate } from "astro:transitions/client";

export default function ConditionFilter() {
    const carCondition = useYogaCarStore((state) => state.carCondition);
    const setCarCondition = useYogaCarStore((state) => state.setCarCondition);
    const setYearRangeValue = useYogaCarStore((state) => state.setYearRangeValue);
    const setMilesRangeValue = useYogaCarStore((state) => state.setMilesRangeValue);

    const toggleUrl = (type: 'new' | 'used') => {
        setYearRangeValue(undefined);
        setMilesRangeValue(undefined);
        navigate(`/${type}-vehicles-quincy-ma/`);
    };

    useEffect(() => {
        const pathCondition = window.location.pathname.includes('new') ? 'new' : 'used';
        setCarCondition(pathCondition);
    }, []);

    return (
        <div className="m-2 flex">
            <button
                className={`w-full rounded-l-lg border-y border-l py-2 ${carCondition === 'new' ? 'border-primary bg-primary text-white' : 'bg-white text-black'}`}
                onClick={() => {
                    setCarCondition('new');
                    toggleUrl('new');
                }}
            >
                New
            </button>
            <button
                className={`w-full rounded-r-lg border-y border-r py-2 ${carCondition === 'used' ? 'border-primary bg-primary text-white' : 'bg-white text-black'}`}
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
