import Loading, { LoadingProps } from "#/components/elements/loading";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { type FC, type ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type LoadingContextProps = {
  show: (id: string) => void;
  hide: (id: string) => void;
  hideAbsolute: () => void;
  showed: boolean;
};

const LoadingContext = createContext<LoadingContextProps>({
  show: () => { },
  hide: () => { },
  hideAbsolute: () => { },
  showed: false,
});

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

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  const id = useRef(StringUtils.generateUuidV4());

  const show = () => {
    ctx.show(id.current);
  };

  const hide = (absolute?: boolean) => {
    if (absolute) {
      ctx.hideAbsolute();
      return;
    }
    ctx.hide(id.current);
  };

  useEffect(() => {
    return () => {
      hide();
    };
  }, []);

  return { show, hide, loading: ctx.showed };
};

export default LoadingProvider;