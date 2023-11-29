import strJoin from "../../objects/string/join";
import { getDynamicUrlContext, type DynamicUrlContextOptions } from "../../utilities/url";

export type WindowOpenOptions = {
  closed?: () => void;
  replaced?: () => void;
  target?: string;
  popup?: boolean;
};

export const windowOpen = (href?: string | null | undefined, options?: WindowOpenOptions) => {
  const win = typeof window === "undefined" ?
    undefined : window.open(href || "/loading", options?.target, (() => {
      return strJoin(
        ",",
        // "noreferrer",
        options?.popup ? "popup" : undefined,
      );
    })());
  let showed = win != null;
  return {
    window: win,
    replace: (href: string) => {
      if (!showed) return;
      if (win) win.location.href = href;
      options?.replaced?.();
    },
    close: () => {
      if (!showed) return;
      if (win) win.close();
      showed = false;
      options?.closed?.();
    },
    showed: () => showed,
  } as const;
};

export const pageOpen = (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
  return windowOpen(getDynamicUrlContext(url, params, options).url);
};