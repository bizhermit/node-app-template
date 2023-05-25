import queryString from "querystring";

export const getDynamicUrlContext = <T extends Struct | FormData | undefined | null>(
  pathName: PagePath | ApiPath,
  params?: T,
  options?: {
    appendQuery?: boolean;
    leaveDynamicKey?: boolean;
    useOriginParams?: boolean;
  }
): {
  url: string;
  data: T;
} => {
  const data: Struct | FormData = (options?.useOriginParams ? params : (() => {
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
  pathName.match(/\[([^\]]*)\]/g)?.forEach(dynamicKey => {
    const key = dynamicKey.match(/\[(.*)\]/)![1];
    const v = getValue(key);
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
      if (data instanceof FormData) {
        const d: Struct = {};
        data.forEach((v, k) => {
          if (k in d) {
            if (!Array.isArray(d[k])) {
              d[k] = [d[k]];
            }
            d[k].push(v);
            return;
          }
          d[k] = v;
        });
        return d;
      }
      return data;
    })());
    if (q) url += `?${q}`;
  }

  return { url, data: data as T };
};