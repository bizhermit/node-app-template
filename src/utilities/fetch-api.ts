import { getDynamicUrlContext } from "@/utilities/url";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

type FetchOptions = {};

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

const convertToRequestInit = (params?: any, _options?: FetchOptions): RequestInit => {
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
    return { body: String(params) };
  }
  return {
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
};

const update = <T>(url: ApiPath, method: ApiMethods, params: any = undefined, options?: FetchOptions) => {
  const ctx = getDynamicUrlContext(url, params);
  return crossFetch<T>(`/api${ctx.url}`, {
    method,
    ...(convertToRequestInit(ctx.data, options)),
  });
};

const fetchApi = {
  get: <U extends ApiPath>(url: U, params?: ApiRequest<U, "get">, _options?: FetchOptions) => {
    const ctx = getDynamicUrlContext(url, params, { appendQuery: true });
    return crossFetch<ApiResponse<U, "get">>(`/api${ctx.url}`, { method: "GET" });
  },
  put: <U extends ApiPath>(url: U, params?: ApiRequest<U, "put">, options?: FetchOptions) => {
    return update<ApiResponse<U, "put">>(url, "put", params, options);
  },
  post: <U extends ApiPath>(url: U, params?: ApiRequest<U, "post">, options?: FetchOptions) => {
    return update<ApiResponse<U, "post">>(url, "post", params, options);
  },
  delete: <U extends ApiPath>(url: U, params?: ApiRequest<U, "delete">, options?: FetchOptions) => {
    return update<ApiResponse<U, "delete">>(url, "delete", params, options);
  },
};

export default fetchApi;