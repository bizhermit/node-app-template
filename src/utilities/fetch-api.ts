import { RequestInit } from "next/dist/server/web/spec-extension/request";

type FetchOptions = {

};

const electron = (global as any).electron;

const toData = (status: number, text?: string) => {
  if (status === 204 || !text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const fetchElectron = async <T>(url: string, init?: RequestInit) => {
  const res = await electron.fetch(url, init);
  return {
    ok: res.ok as boolean,
    status: res.status as number,
    statusText: res.statusText as string,
    data: toData(res.status, res.text) as T,
  };
};

const fetchServer = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    data: toData(res.status, await res.text()) as T,
  };
};

const crossFetch = async <T>(url: string, init?: RequestInit) => {
  if (electron) return fetchElectron<T>(url, init);
  return fetchServer<T>(url, init);
};

const convertUrl = (url: string, params?: any, options?: FetchOptions) => {
  return `/api${url}`;
};

const convertToRequestInit = (params?: any, options?: FetchOptions): RequestInit => {
  if (params == null) {
    return {};
  }
  if (params instanceof FormData) {
    return {
      body: params,
    };
  }
  const t = typeof params;
  if (t === "string" || t === "bigint" || t === "number" || t === "boolean") {
    return {
      body: String(params),
    };
  }
  return {
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
};

const fetchApi = {
  get: <U extends keyof Api>(url: U, params: PickApiParameter<Api, U, "get", "req"> = undefined, options?: FetchOptions) => {
    return crossFetch<PickApiParameter<Api, U, "get", "res">>(convertUrl(url, params, options), { method: "GET" });
  },
  put: <U extends keyof Api>(url: U, params: PickApiParameter<Api, U, "put", "req"> = undefined, options?: FetchOptions) => {
    return crossFetch<PickApiParameter<Api, U, "put", "res">>(convertUrl(url, params, options), {
      method: "PUT",
      ...(convertToRequestInit(params, options)),
    });
  },
  post: <U extends keyof Api>(url: U, params: PickApiParameter<Api, U, "post", "req"> = undefined, options?: FetchOptions) => {
    return crossFetch<PickApiParameter<Api, U, "post", "res">>(convertUrl(url, params, options), {
      method: "POST",
      ...(convertToRequestInit(params, options)),
    });
  },
  delete: <U extends keyof Api>(url: U, params: PickApiParameter<Api, U, "delete", "req"> = undefined, options?: FetchOptions) => {
    return crossFetch<PickApiParameter<Api, U, "delete", "res">>(convertUrl(url, params, options), {
      method: "DELETE",
      ...(convertToRequestInit(params, options)),
    });
  },
};

export default fetchApi;