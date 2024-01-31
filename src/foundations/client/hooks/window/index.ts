import { useContext, useEffect, useRef } from "react";
import { windowOpen, type WindowOpenOptions } from "../../utilities/window-open";
import { WindowContext, type WindowContextParams, type WindowOptions } from "./context";

const useWindow = (defaultOptions: WindowOptions = { closeWhenTabClose: true }) => {
  const ctx = useContext(WindowContext);
  const wins = useRef<Array<WindowContextParams>>([]);

  const filter = () => {
    wins.current = wins.current.filter(item => item.window.showed());
  };

  const open = (href?: string | null | undefined, options?: WindowOpenOptions & WindowOptions) => {
    const opts = { ...options, ...defaultOptions };
    const beforeunloadEvent = () => {
      win.close();
    };
    const useBeforeunload = opts?.closeWhenUnmount || opts.closeWhenPageMove || opts?.closeWhenTabClose;
    if (useBeforeunload) {
      window.addEventListener("beforeunload", beforeunloadEvent);
    }
    const win = windowOpen(href || "/loading", {
      ...options,
      closed: () => {
        if (useBeforeunload) {
          window.removeEventListener("beforeunload", beforeunloadEvent);
        }
        options?.closed?.();
      },
    });
    if (opts.closeWhenPageMove) ctx.append(win);
    wins.current.push({
      window: win,
      options: opts,
    });
    return win;
  };

  const closeChildren = (params?: {
    unmout?: boolean;
    page?: boolean;
    tab?: boolean;
  }) => {
    wins.current.forEach(item => {
      if (!item.window.showed()) return;
      if (
        params == null ||
        (params.unmout && item.options?.closeWhenUnmount) ||
        (params.page && item.options?.closeWhenPageMove) ||
        (params.tab && item.options?.closeWhenTabClose)
      ) {
        item.window.close();
      }
    });
    filter();
  };

  const close = () => {
    if (typeof window === "undefined") return;
    if (window.opener) window.close();
  };

  useEffect(() => {
    return () => closeChildren({ unmout: true });
  }, []);

  return {
    open,
    closeChildren,
    close,
  } as const;
};

export default useWindow;