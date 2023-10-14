import { createContext, useContext, useEffect, useRef } from "react";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

type LoadingContextProps = {
  show: (id: string) => void;
  hide: (id: string) => void;
  hideAbsolute: () => void;
  showed: boolean;
};

export const LoadingContext = createContext<LoadingContextProps>({
  show: () => { },
  hide: () => { },
  hideAbsolute: () => { },
  showed: false,
});

const useLoading = () => {
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

export default useLoading;