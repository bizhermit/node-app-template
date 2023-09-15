import { createContext, useContext, useEffect, useRef } from "react";
import { windowOpen } from "../../utilities/window-open";

export type WindowOptions = {
  closeWhenUnmount?: boolean;
  closeWhenPageMove?: boolean;
  closeWhenTabClose?: boolean;
};

export type WindowContextParams = {
  window: ReturnType<typeof windowOpen>;
  options: WindowOptions | null | undefined;
};

type WindowContextProps = {
  append: (ctx: ReturnType<typeof windowOpen>) => void;
};

export const WindowContext = createContext<WindowContextProps>({
  append: () => { },
});

const useWindow = (defaultOptions: WindowOptions = { closeWhenTabClose: true }) => {
  const ctx = useContext(WindowContext);
  const wins = useRef<Array<WindowContextParams>>([]);

  const filter = () => {
    wins.current = wins.current.filter(item => item.window.showed());
  };

  const open = (href?: string | null | undefined, options?: WindowOptions) => {
    const opts = { ...options, ...defaultOptions };
    const beforeunloadEvent = () => {
      win.close();
    };
    const useBeforeunload = opts?.closeWhenUnmount || opts.closeWhenPageMove || opts?.closeWhenTabClose;
    if (useBeforeunload) {
      window.addEventListener("beforeunload", beforeunloadEvent);
    }
    const win = windowOpen(href || "/loading", {
      closed: () => {
        if (useBeforeunload) {
          window.removeEventListener("beforeunload", beforeunloadEvent);
        }
      },
    });
    if (opts.closeWhenPageMove) ctx.append(win);
    wins.current.push({
      window: win,
      options: opts,
    });
    return win;
  };

  const close = (params?: {
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

  useEffect(() => {
    return () => close({ unmout: true });
  }, []);

  return {
    open,
    close,
  } as const;
};

export default useWindow;