import { useCallback, useEffect, useState, type DependencyList } from "react";
import throttle from "../../utilities/throttle";

export const useThrottle = <T>(value: T, timeout = 0) => {
  const [v, s] = useState(value);
  const set = useThrottleCallback((val: T) => s(val), timeout, []);
  useEffect(() => {
    set(value);
  }, [value]);
  return [v, set];
};

export const useThrottleCallback = <T extends Array<any>>(func: Parameters<typeof throttle<T>>["0"], timeout = 0, deps: DependencyList) => {
  return useCallback(throttle(func, timeout), deps);
};
