import { getDynamicUrlContext, type DynamicUrlContextOptions } from "../../utilities/url";

type Options = {
  closed?: () => void;
  replaced?: () => void;
};

export const windowOpen = (href?: string | null | undefined, options?: Options) => {
  const win = typeof window === "undefined" ?
    undefined : window.open(href || "/loading");
  return {
    window: win,
    replace: (href: string) => {
      if (win) win.location.href = href;
      options?.replaced?.();
    },
    close: () => {
      if (win) win.close();
      options?.closed?.();
    },
  } as const;
};

export const pageOpen = (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
  return windowOpen(getDynamicUrlContext(url, params, options).url);
};