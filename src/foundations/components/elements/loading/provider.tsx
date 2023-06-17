"use client";

import Loading, { type LoadingProps } from "#/components/elements/loading";
import { LoadingContext } from "#/components/elements/loading/context";
import { type FC, type ReactNode, useCallback, useState } from "react";

const LoadingProvider: FC<{ children?: ReactNode; } & LoadingProps> = (props) => {
  const [ids, setIds] = useState<Array<string>>([]);

  const show = useCallback((id: string) => {
    setIds(ids => {
      if (ids.find(v => v === id)) return ids;
      const newIds = [...ids, id];
      return newIds;
    });
  }, []);

  const hide = useCallback((id: string) => {
    setIds(ids => {
      const idx = ids.findIndex(v => v === id);
      if (idx < 0) return ids;
      return [...ids].splice(idx + 1, 1);
    });
  }, []);

  const hideAbsolute = useCallback(() => {
    setIds(ids => {
      if (ids.length === 0) return ids;
      return [];
    });
  }, []);

  const loadingProps = (() => {
    const p = { ...props };
    delete p.children;
    return p;
  })();

  return (
    <LoadingContext.Provider
      value={{
        show,
        hide,
        hideAbsolute,
        showed: ids.length > 0,
      }}
    >
      {ids.length > 0 && <Loading {...loadingProps} />}
      {props.children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;