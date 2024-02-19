import { useCallback, useEffect, useState, type DependencyList } from "react";
import debounce from "../../utilities/debounce";

export const useDebounce = <T>(value: T, delay = 0) => {
  const [v, s] = useState(value);
  const set = useDebounceCallback((val: T) => s(val), delay, []);
  useEffect(() => {
    set(value);
  }, [value]);
  return [v, set];
};

export const useDebounceCallback = <T extends Array<any>>(func: Parameters<typeof debounce<T>>["0"], delay = 0, deps: DependencyList) => {
  return useCallback(debounce(func, delay), deps);
};
