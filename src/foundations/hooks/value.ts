import { equals } from "#/data-items/utilities";
import { useCallback, useRef, useState } from "react";

export type ValueObject<T> = ReturnType<typeof useValue<T>>;

export const emptyValueObject: ValueObject<any> = {
  ref: {
    current: undefined as any,
  },
  value: undefined as any,
  set: () => { },
};

const useValue = <T>(init?: T, change?: (after: T, before: T) => void) => {
  const [value, setValue] = useState<T>(init as any);
  const ref = useRef(value);

  const set = useCallback((v: T | ((state: T) => T)) => {
    const newValue = typeof v === "function" ? (v as (state: T) => T)(ref.current) : v;
    if (equals(newValue, ref.current)) return;
    change?.(newValue, ref.current);
    ref.current = newValue;
    setValue(newValue);
  }, []);

  return {
    value,
    ref,
    set,
  } as const;
};

export default useValue;