import { getValue } from "../struct/get";

type Pathname = PagePath | ApiPath | `http${string}` | `tel:${string}` | `mailto:${string}`

const replaceDynamicPathname = <
  T extends Pathname,
  P extends { [v: string | number | symbol]: any } | null | undefined
>(pathname: T, params: P, get: ((params: P, key: string) => any) = getValue): T => {
  if (pathname == null) return pathname;
  return encodeURI(pathname.replace(/\[\[?([^\]]*)\]?\]/g, seg => {
    const r = seg.match(/^\[{1,2}(\.{3})?([^\]]*)\]{1,2}$/)!;
    const v = get(params, r[2]);
    if (Array.isArray(v)) {
      if (r[1]) return v.map(c => `${c}`).join("/");
      return v[0];
    }
    return v ?? "";
  })) as T;
};

export default replaceDynamicPathname;
