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
    removeSessionValue(key);
    return value;
  }
  window.sessionStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const useSessionState = <S = undefined>(key: string, initialState: S | (() => S)) => {
  const [loaded, setLoaded] = useState(false);
  const [val, setImpl] = useState<S>(initialState);

  const clear = () => {
    removeSessionValue(key);
  };

  const save = () => {
    setSessionValue(key, val);
  };

  const set = (v: S | ((current: S) => S)) => {
    let l = loaded;
    setLoaded(cur => {
      l = cur;
      return cur;
    });
    if (!l) return false;
    setImpl(cur => {
      if (typeof v === "function") {
        return (v as Function)(cur) as S;
      }
      return v;
    });
    return true;
  };

  useEffect(() => {
    if (!loaded) return;
    setSessionValue(key, val);
  }, [val]);

  useEffect(() => {
    const v = getSessionValue<S>(key);
    if (v == null) {
      if (typeof initialState === "function") {
        setImpl((initialState as Function)());
      } else {
        setImpl(initialState);
      }
    } else {
      setImpl(v);
    }
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
    removeSessionValue(key);
    return value;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const useLocalState = <S = undefined>(key: string, initialState: S | (() => S)) => {
  const [loaded, setLoaded] = useState(false);
  const [val, setImpl] = useState<S>(initialState);

  const clear = () => {
    removeLocalValue(key);
  };

  const save = () => {
    setLocalValue(key, val);
  };

  const set = (v: S | ((current: S) => S)) => {
    let l = loaded;
    setLoaded(cur => {
      l = cur;
      return cur;
    });
    if (!l) return false;
    setImpl(cur => {
      if (typeof v === "function") {
        return (v as Function)(cur) as S;
      }
      return v;
    });
    return true;
  };

  useEffect(() => {
    if (!loaded) return;
    setLocalValue(key, val);
  }, [val]);

  useEffect(() => {
    const v = getLocalValue<S>(key);
    if (v == null) {
      if (typeof initialState === "function") {
        setImpl((initialState as Function)());
      } else {
        setImpl(initialState);
      }
    } else {
      setImpl(v);
    }
    setLoaded(true);
  }, []);

  return [val, set, { loaded, clear, save }] as const;
};
