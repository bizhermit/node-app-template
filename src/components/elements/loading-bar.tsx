import { attributesWithoutChildren } from "@/components/utilities/attributes";
import React, { createContext, FC, HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/loading-bar.module.scss";
import usePortalElement from "@/hooks/portal-element";
import { createPortal } from "react-dom";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type LoadingBarProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $reverseColor?: boolean;
  $fixed?: boolean;
};

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-fixed={props.$fixed}
    >
      <div className={`${Style.bar} bgc-${props.$color || "main"}${props.$reverseColor ? "_r" : ""}`} />
    </div>
  );
});

export default LoadingBar;

export const ScreenLoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>((props, ref) => {
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add(Style.root);
    }
  });

  if (portal == null) return <></>;
  return createPortal(<LoadingBar {...props} ref={ref} $fixed />, portal);
});

type LoadingBarContextProps = {
  show: (id: string) => void;
  hide: (id: string) => void;
  hideAbsolute: () => void;
  showed: boolean;
};

const LoadingBarContext = createContext<LoadingBarContextProps>({
  show: () => { },
  hide: () => { },
  hideAbsolute: () => { },
  showed: false,
});

export const useLoadingBar = () => {
  const ctx = useContext(LoadingBarContext);
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

  return { show, hide, showed: ctx.showed };
};

export const LoadingBarProvider: FC<{ children?: ReactNode; } & LoadingBarProps> = (props) => {
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

  return (
    <LoadingBarContext.Provider
      value={{
        show,
        hide,
        hideAbsolute,
        showed: ids.length > 0,
      }}
    >
      {ids.length > 0 && <LoadingBar {...props} />}
      {props.children}
    </LoadingBarContext.Provider>
  );
};