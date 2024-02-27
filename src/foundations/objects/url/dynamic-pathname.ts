import { getValue } from "../struct/get";

type Href = PagePath | `http${string}` | `tel:${string}` | `mailto:${string}`

const replaceDynamicPathname = <T extends Href>(href: T, params: { [v: string | number | symbol]: any } | null | undefined): T => {
  if (href == null) return href;
  return href.replace(/\[\[?([^\]]*)\]?\]/g, seg => {
    const r = seg.match(/^\[{1,2}(\.{3})?([^\]]*)\]{1,2}$/)!;
    const v = getValue(params, r[2]);
    if (Array.isArray(v)) {
      if (r[1]) return v.map(c => `${c}`).join("/");
      return v[0];
    }
    return v ?? "";
  }) as T;
};

export default replaceDynamicPathname;
