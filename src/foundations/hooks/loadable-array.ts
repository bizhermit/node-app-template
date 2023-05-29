import { useEffect, useRef, useState } from "react";

export type LoadableArray<T = Struct> = Array<T> | (() => Array<T>) | (() => Promise<Array<T>>);

type Options = {
  preventMemorize?: boolean;
};

const useLoadableArray = <T = Struct>(loadableArray?: LoadableArray<T>, options?: Options) => {
  const initialized = useRef(false);
  const initPromise = useRef<Promise<Array<T>>>(null!);
  const [array, setArray] = useState<Array<T>>(() => {
    if (loadableArray == null || Array.isArray(loadableArray)) return loadableArray ?? [];
    const arr = loadableArray();
    if (arr == null || Array.isArray(arr)) return arr ?? [];
    initPromise.current = arr;
    return [];
  });
  const [loading, setLoading] = useState(initPromise.current != null);

  useEffect(() => {
    if (!initialized.current) {
      if (initPromise.current == null) {
        initialized.current = true;
        return;
      }
      initPromise.current.then(arr => {
        initialized.current = true;
        setArray(arr ?? []);
        setLoading(false);
      });
      return;
    }

    if (options?.preventMemorize !== true) return;
    if (loadableArray == null || Array.isArray(loadableArray)) {
      setArray(loadableArray ?? []);
      return;
    }
    const arr = loadableArray();
    if (arr == null || Array.isArray(arr)) {
      setArray(arr ?? []);
      return;
    }
    setLoading(true);
    arr.then(arr => {
      setArray(arr ?? []);
      setLoading(false);
    });
  }, [loadableArray]);

  return [array, loading] as const;
};

export default useLoadableArray;