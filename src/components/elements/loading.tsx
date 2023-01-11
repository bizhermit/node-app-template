import { attributesWithoutChildren } from "@/components/utilities/attributes";
import React, { createContext, FC, HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/loading.module.scss";
import usePortalElement from "@/hooks/portal-element";
import { createPortal } from "react-dom";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type LoadingAppearance = "bar" | "circle";

type OmitAttributes = "color" | "children";
export type LoadingProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $color?: Color;
  $reverseColor?: boolean;
  $fixed?: boolean;
  $appearance?: LoadingAppearance;
};

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const appearance = props.$appearance || "bar";

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-fixed={props.$fixed}
      data-appearance={appearance}
    >
      {appearance === "bar" &&
        <div className={`${Style.bar} bgc-${props.$color || "main"}${props.$reverseColor ? "_r" : ""}`} />
      }
      {appearance === "circle" &&
        <div className={`${Style.circle} bdc-${props.$color || "main"}${props.$reverseColor ? "_r" : ""}`} />
      }
    </div>
  );
});

export default Loading;

export const ScreenLoading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add(Style.root);
    }
  });

  if (portal == null) return <></>;
  return createPortal(<Loading {...props} ref={ref} $fixed />, portal);
});

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

export const LoadingProvider: FC<{ children?: ReactNode; } & LoadingProps> = (props) => {
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
    <LoadingContext.Provider
      value={{
        show,
        hide,
        hideAbsolute,
        showed: ids.length > 0,
      }}
    >
      {ids.length > 0 && <Loading {...props} />}
      {props.children}
    </LoadingContext.Provider>
  );
};