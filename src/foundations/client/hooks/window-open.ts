import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useEffect, useRef } from "react";
import { windowOpen } from "../utilities/window-open";

type Options = {
  closeWhenTabClose?: boolean;
  closeWhenUnmount?: boolean;
};

type WindowContext = {
  id: string;
  window: ReturnType<typeof windowOpen>;
  options: Options | null | undefined;
};

const useWindow = (defaultOptions?: Options) => {
  const wins = useRef<Array<WindowContext>>([]);

  const open = (href: string | null | undefined, options?: Options) => {
    const id = StringUtils.generateUuidV4();
    const opts = { ...options, ...defaultOptions };
    const beforeunloadEvent = () => {
      win.close();
    };
    const useBeforeunload = opts?.closeWhenUnmount || opts?.closeWhenTabClose;
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
    wins.current.push({
      id,
      window: win,
      options: opts,
    });
    return win;
  };

  const close = (mode?: "all" | "unmount" | "tab" | "unmount/tab") => {
    wins.current.forEach(item => {
      if (
        mode === "all" ||
        ((mode === "unmount" || mode === "unmount/tab")
          && item.options?.closeWhenUnmount) ||
        ((mode === "tab" || mode === "unmount/tab")
          && item.options?.closeWhenTabClose)
      ) {
        item.window.close();
      }
    });
  };

  useEffect(() => {
    return () => close("unmount");
  }, []);

  return {
    open,
    close,
  } as const;
};

export default useWindow;