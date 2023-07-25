import { type DynamicUrlContextOptions, getDynamicUrlContext } from "#/utilities/url";

export const windowOpen = (href?: string | null | undefined) => {
  const win = typeof window === "undefined" ?
    undefined : window.open(href || "/loading");
  return {
    replace: (href: string) => {
      if (!win) return;
      win.location.href = href;
    },
    close: () => {
      if (!win) return;
      win.close();
    },
  } as const;
};

export const pageOpen = (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
  return windowOpen(getDynamicUrlContext(url, params, options).url);
};