import { useEffect, useRef, useState } from "react";

type Options = {
  preventMemorize?: boolean;
};

export type LoadableArray<T = { [v: string | number | symbol]: any }> = Array<T> | Readonly<Array<T>> | (() => Array<T>) | (() => Promise<Array<T>>);

const isArray = <T>(loadableArray?: LoadableArray<T>): loadableArray is (Array<T> | Readonly<Array<T>>) => {
  return Array.isArray(loadableArray);
};

const useLoadableArray = <T = { [v: string | number | symbol]: any }>(loadableArray?: LoadableArray<T>, options?: Options) => {
  const initialized = useRef(false);
  const loadId = useRef(0);
  const initPromise = useRef<Promise<Array<T>>>(null!);
  const [array, setArray] = useState<Array<T>>(() => {
    if (loadableArray == null || isArray(loadableArray)) {
      return loadableArray as Array<T> ?? [];
    }
    const arr = loadableArray();
    if (arr == null || Array.isArray(arr)) return arr ?? [];
    initPromise.current = arr;
    return [];
  });
  const [loading, setLoading] = useState(initPromise.current != null);

  const load = (props?: {
    switchLoadingFlag?: boolean;
    callback?: (res: { ok: boolean; interruptted?: boolean; }) => void;
  }) => {
    if (loadableArray == null || isArray(loadableArray)) {
      setArray(loadableArray as Array<T> ?? []);
      props?.callback?.({ ok: true });
      return;
    }
    const arr = loadableArray();
    if (arr == null || Array.isArray(arr)) {
      setArray(arr ?? []);
      props?.callback?.({ ok: true });
      return;
    }
    const id = ++loadId.current;
    if (props?.switchLoadingFlag) setLoading(true);
    arr.then(arr => {
      if (id !== loadId.current) {
        props?.callback?.({ ok: false, interruptted: true });
        return;
      }
      setArray(arr ?? []);
      if (props?.switchLoadingFlag) setLoading(false);
      props?.callback?.({ ok: true });
    });
  };

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
    load({ switchLoadingFlag: true });
  }, [loadableArray]);

  return [array, loading, load] as const;
};

export default useLoadableArray;
