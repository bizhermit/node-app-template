import clone from "../clone";
import { convertFormDataToStruct } from "../form-data/convert";
import { getValue } from "../struct/get";
import replaceDynamicPathname from "./dynamic-pathname";

type UrlPath = PagePath | `http${string}` | `tel:${string}` | `mailto:${string}` | ApiPath;

export type DynamicUrlOptions = {
  appendQuery?: boolean;
  leaveDynamicKey?: boolean;
  useOriginParams?: boolean;
  queryArrayIndex?: boolean;
};

const getDynamicUrlContext = <
  T extends { [v: string | number | symbol]: any } | FormData | null | undefined,
  U extends UrlPath = UrlPath
>(pathname: U, params?: T, opts?: DynamicUrlOptions): { url: U; data: T } => {
  const data: { [v: string | number | symbol]: any } | FormData = (opts?.useOriginParams ? params : (() => {
    if (params == null) return {};
    if (params instanceof FormData) {
      const fd = new FormData();
      params.forEach((v, k) => fd.append(k, v));
      return fd;
    }
    return clone(params);
  })()) ?? {};

  let url: string = replaceDynamicPathname(pathname, data, (d, k) => {
    if (d instanceof FormData) {
      const v = d.get(k);
      if (opts?.leaveDynamicKey !== true) d.delete(k);
      return v;
    }
    const v = getValue(d, k);
    if (opts?.leaveDynamicKey !== true) delete d[k];
    return v;
  });

  if (opts?.appendQuery) {
    const q = (() => {
      if (data == null) return undefined;
      const sd = data instanceof FormData ? convertFormDataToStruct(data) : data;
      const enc = (v: string | number | boolean) => encodeURIComponent(v);
      return Object.keys(sd).map(key => {
        const v = sd[key];
        if (v == null) return undefined;
        if (Array.isArray(v)) {
          if (opts.queryArrayIndex) {
            return v.map((val, i) => `${enc(`${key}[${i}]`)}=${enc(val)}`);
          }
          return v.map(val => `${enc(key)}=${enc(val)}`);
        }
        return `${enc(key)}=${enc(v)}`;
      }).flat(1).filter(s => s).join("&");
    })();
    if (q) url += `?${q}`;
  }

  return { url: url as U, data: data as T };
};

export const getDynamicUrl = <
  U extends UrlPath = UrlPath
>(pathname: U, params?: { [v: string | number | symbol]: any }, opts?: DynamicUrlOptions) => {
  return getDynamicUrlContext(pathname, params, opts).url;
};

export default getDynamicUrlContext;
