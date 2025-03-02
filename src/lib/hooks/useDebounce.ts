import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';

export default function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  timer: number = 500
) {
  const ref = useRef<typeof callback>(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func: typeof callback = (...args) => {
      ref.current?.(...args);
    };

    return debounce(func, timer);
  }, []);

  return debouncedCallback;
}
