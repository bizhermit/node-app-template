"use client";

import { useCallback, useState, type FC, type ReactNode } from "react";
import Loading, { type LoadingProps } from ".";
import { LoadingContext } from "./context";

const LoadingProvider: FC<{ children?: ReactNode; } & LoadingProps> = ({
  children,
  ...props
}) => {
  const [ids, setIds] = useState<Array<string>>([]);

  const show = useCallback((id: string) => {
    setIds(ids => ids.find(v => v === id) ? ids : [...ids, id]);
  }, []);

  const hide = useCallback((id: string) => {
    setIds(ids => {
      const idx = ids.findIndex(v => v === id);
      return idx < 0 ? ids : [...ids].splice(idx + 1, 1);
    });
  }, []);

  const hideAbsolute = useCallback(() => {
    setIds(ids => ids.length === 0 ? ids : []);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        show,
        hide,
        hideAbsolute,
        showed: ids.length > 0,
      }}
    >
      {ids.length > 0 && <Loading {...props} />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
