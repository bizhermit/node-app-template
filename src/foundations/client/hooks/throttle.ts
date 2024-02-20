import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import throttle from "../../utilities/throttle";

export const useThrottle = <T>(value: T, timeout = 0) => {
  const [v, s] = useState(value);
  const set = useThrottleCallback((val: T) => s(val), timeout, [timeout]);
  useEffect(() => {
    set(value);
  }, [value]);
  return [v, set];
};

export const useThrottleCallback = <T extends Array<any>>(func: Parameters<typeof throttle<T>>["0"], timeout = 0, deps: DependencyList) => {
  const ref = useRef<{ t: (NodeJS.Timeout | null); l: number; }>({ t: null, l: Date.now() });
  return useCallback((...args: T) => {
    const { t, l } = ref.current;
    if (t) clearTimeout(t);
    ref.current.t = setTimeout(() => {
      func(...args);
      ref.current = { t: null, l: Date.now() };
    }, timeout - (Date.now() - l));
  }, deps);
};
