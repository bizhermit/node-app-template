import queryString from "querystring";
import { convertFormDataToStruct } from "./form-data";

export type DynamicUrlContextOptions = {
  appendQuery?: boolean;
  leaveDynamicKey?: boolean;
  useOriginParams?: boolean;
  queryArrayIndex?: boolean;
};

type UrlPath = PagePath | RelativePagePath | `http${string}` | `tel:${string}` | `mailto:${string}` | ApiPath;

export const getDynamicUrlContext = <
  T extends Struct | FormData | undefined | null,
  U extends UrlPath = UrlPath
>(pathName: U, params?: T, options?: DynamicUrlContextOptions): {
  url: U;
  data: T;
} => {
  const data: Struct | FormData = (options?.useOriginParams ? params : (() => {
    if (params == null) return {};
    if (params instanceof FormData) {
      const fd = new FormData();
      params.forEach((v, k) => fd.append(k, v));
      return fd;
    }
    return { ...params };
  })()) ?? {};

  const getValue = (key: string) => {
    if (data instanceof FormData) {
      const v = data.get(key);
      if (options?.leaveDynamicKey !== true) data.delete(key);
      return v;
    }
    const v = data[key];
    if (options?.leaveDynamicKey !== true) delete data[key];
    return v;
  };

  let url: string = pathName;
  pathName.match(/\[\[?([^\]]*)\]?\]/g)?.forEach(dynamicKey => {
    const key = dynamicKey.match(/\[(.*)\]/)![1];
    const slugKey = key.match(/^\[(?:\.\.\.)(.*)\]$/)?.[1];
    const v = (() => {
      if (slugKey) {
        const slugV = getValue(slugKey);
        if (slugV != null) {
          if (Array.isArray(slugV)) {
            return slugV.map(v => `${v}`).join("/");
          }
          return slugV;
        }
      }
      return getValue(key);
    })();
    url = url.replace(dynamicKey, (() => {
      if (v == null) return "";
      if (typeof v === "object") {
        if (Array.isArray(v)) {
          // eslint-disable-next-line no-console
          console.warn("too many keys: ", key);
          return String(v[0] ?? "");
        }
        // eslint-disable-next-line no-console
        console.error("value is not supported type: ", key);
        return "";
      }
      return String(v ?? "");
    })());
  });

  if (options?.appendQuery) {
    const q = queryString.stringify((() => {
      if (data == null) return {};
      const sd = data instanceof FormData ? convertFormDataToStruct(data) : data;
      const d: { [key: string]: any } = {};
      Object.keys(sd).forEach(key => {
        const v = sd[key];
        if (v == null) return;
        if (options.queryArrayIndex && Array.isArray(v)) {
          v.forEach((val, i) => {
            d[`${key}[${i}]`] = val;
          });
          return;
        }
        d[key] = v;
      });
      return d;
    })());
    if (q) url += `?${q}`;
  }

  return { url: url as U, data: data as T };
};

export const getDynamicUrl = <
  T extends Struct | FormData | undefined | null,
  U extends UrlPath = UrlPath
>(pathName: U, params?: T, options?: DynamicUrlContextOptions) => {
  return getDynamicUrlContext<T, U>(pathName, params, options).url;
};