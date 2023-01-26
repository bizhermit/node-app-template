import { useEffect, useState } from "react";

const getSessionValue = <V>(key: string) => {
  if (typeof window === "undefined") return undefined;
  const v = window.sessionStorage.getItem(key);
  if (v == null) return undefined;
  return JSON.parse(v) as V;
};

const removeSessionValue = (key: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(key);
};

const setSessionValue = <V = any>(key: string, value: V) => {
  if (typeof window === "undefined") return value;
  if (value == null) {
    window.sessionStorage.removeItem(key);
    return value;
  }
  window.sessionStorage.setItem(key, JSON.stringify(value));
  return value;
};

type Options = {
  autoSave?: boolean;
};

export const useSessionState = <S = undefined>(key: string, initialState: S | (() => S), options?: Options) => {
  const [loaded, setLoaded] = useState(false);
  const [val, setImpl] = useState(initialState);

  const clear = () => {
    removeSessionValue(key);
  };

  const save = () => {
    setSessionValue(key, val);
  };

  const set = (value: S | ((current: S) => S), save?: boolean) => {
    let l = loaded;
    setLoaded(cur => l = cur);
    if (!l) return false;
    setImpl(state => {
      const s = save || (options?.autoSave !== false && save !== false);
      const v = (() => {
        if (typeof value === "function") {
          return (value as Function)(state) as S;
        }
        return value;
      })();
      if (!Object.is(state, v) && s) {
        setSessionValue(key, v);
      }
      return v;
    });
    return true;
  };

  useEffect(() => {
    set(getSessionValue<S>(key) ?? initialState);
    setLoaded(true);
  }, []);

  return [val, set, { loaded, clear, save }] as const;
};

const getLocalValue = <V>(key: string) => {
  if (typeof window === "undefined") return undefined;
  const v = window.localStorage.getItem(key);
  if (v == null) return undefined;
  return JSON.parse(v) as V;
};

const removeLocalValue = (key: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};

const setLocalValue = <V = any>(key: string, value: V) => {
  if (typeof window === "undefined") return value;
  if (value == null) {
    window.localStorage.removeItem(key);
    return value;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const useLocalState = <S = undefined>(key: string, initialState: S | (() => S), options?: Options) => {
  const [loaded, setLoaded] = useState(false);
  const [val, setImpl] = useState(initialState);

  const clear = () => {
    removeLocalValue(key);
  };

  const save = () => {
    setLocalValue(key, val);
  };

  const set = (value: S | ((current: S) => S), save?: boolean) => {
    let l = loaded;
    setLoaded(cur => l = cur);
    if (!l) return false;
    setImpl(state => {
      const s = save || (options?.autoSave !== false && save !== false);
      const v = (() => {
        if (typeof value === "function") {
          return (value as Function)(state) as S;
        }
        return value;
      })();
      if (!Object.is(state, v) && s) {
        setLocalValue(key, v);
      }
      return v;
    });
    return true;
  };

  useEffect(() => {
    set(getLocalValue<S>(key) ?? initialState);
    setLoaded(true);
  }, []);

  return [val, set, { loaded, clear, save }] as const;
};
