import { attributesWithoutChildren } from "@/components/utilities/attributes";
import { createContext, FC, forwardRef, HTMLAttributes, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Style from "$/components/elements/loading.module.scss";
import usePortalElement from "@/hooks/portal-element";
import { createPortal } from "react-dom";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

export type LoadingAppearance = "bar" | "circle";

type OmitAttributes = "color";
export type LoadingProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $color?: Color;
  $reverseColor?: boolean;
  $fixed?: boolean;
  $mask?: boolean;
  $appearance?: LoadingAppearance;
};

const Loading = forwardRef<HTMLDivElement, LoadingProps>((props, $ref) => {
  const appearance = props.$appearance || "bar";
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const cref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (props.$mask) {
      (cref.current?.querySelector("button") ?? cref.current ?? ref.current)?.focus();
    }
  }, []);

  return (
    <>
      {props.$mask && <Mask1 {...props} />}
      <div
        {...attributesWithoutChildren(props, Style.wrap)}
        ref={ref}
        tabIndex={0}
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
      {props.children != null &&
        <div
          ref={cref}
          tabIndex={0}
          className={Style.content}
          data-fixed={props.$fixed}
        >
          {props.children}
        </div>
      }
      {props.$mask && <Mask2 {...props} />}
    </>
  );
});

const Mask1: FC<LoadingProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask1}
      data-fixed={props.$fixed}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

const Mask2: FC<LoadingProps> = (props) => {
  const keydown = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === "Tab") e.preventDefault();
  };

  return (
    <div
      className={Style.mask2}
      data-fixed={props.$fixed}
      tabIndex={0}
      onKeyDown={keydown}
    />
  );
};

export default Loading;

export const ScreenLoading = forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
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