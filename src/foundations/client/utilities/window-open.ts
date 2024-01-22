import strJoin from "../../objects/string/join";
import { DynamicUrlOptions, getDynamicUrl } from "../../objects/url/dynamic-url";

export type WindowOpenOptions = {
  closed?: () => void;
  replaced?: () => void;
  target?: string;
  popup?: boolean;
};

export const windowOpen = (href?: string | null | undefined, opts?: WindowOpenOptions) => {
  const win = typeof window === "undefined" ?
    undefined : window.open(href || "/loading", opts?.target, (() => {
      return strJoin(
        ",",
        // "noreferrer",
        opts?.popup ? "popup" : undefined,
      );
    })());
  let showed = win != null;
  return {
    window: win,
    replace: (href: string) => {
      if (!showed) return;
      if (win) win.location.replace(href);
      opts?.replaced?.();
    },
    close: () => {
      if (!showed) return;
      if (win) win.close();
      showed = false;
      opts?.closed?.();
    },
    showed: () => showed,
  } as const;
};

export const pageOpen = (url: PagePath, params?: { [v: string | number | symbol]: any }, opts?: DynamicUrlOptions) => {
  return windowOpen(getDynamicUrl(url, params, opts));
};