import { getDynamicUrlContext } from "@/utilities/url";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

export type FetchOptions = {};
export type FetchApiResponse<T> = {
  ok: boolean;
  status: number;
  statusText: string;
  messages: Array<Message>;
  data: T;
};

const electron = (global as any).electron;

const handleResponse = <T>(status: number, text?: string) => {
  if (status === 204 || !text) {
    return {
      messages: [],
      data: undefined as T,
    };
  }
  try {
    const json = JSON.parse(text);
    return {
      messages: json.messages ?? [],
      data: json.data as T,
    };
  } catch {
    return {
      messages: [],
      data: text as T,
    };
  }
};

const fetchElectron = async <T>(url: string, init?: RequestInit) => {
  const res = await electron.fetch(url, init);
  return {
    ok: res.ok as boolean,
    status: res.status as number,
    statusText: res.statusText as string,
    ...handleResponse<T>(res.status, res.text),
  } as FetchApiResponse<T>;
};

const fetchServer = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    ...handleResponse<T>(res.status, await res.text()),
  } as FetchApiResponse<T>;
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
  get: <U extends ApiPath>(url: U, params?: ApiRequest<U, "get"> | FormData, _options?: FetchOptions) => {
    const ctx = getDynamicUrlContext(url, params, { appendQuery: true });
    return crossFetch<ApiResponse<U, "get">>(`/api${ctx.url}`, { method: "GET" });
  },
  put: <U extends ApiPath>(url: U, params?: ApiRequest<U, "put"> | FormData, options?: FetchOptions) => {
    return update<ApiResponse<U, "put">>(url, "put", params, options);
  },
  post: <U extends ApiPath>(url: U, params?: ApiRequest<U, "post"> | FormData, options?: FetchOptions) => {
    return update<ApiResponse<U, "post">>(url, "post", params, options);
  },
  delete: <U extends ApiPath>(url: U, params?: ApiRequest<U, "delete"> | FormData, options?: FetchOptions) => {
    return update<ApiResponse<U, "delete">>(url, "delete", params, options);
  },
};

export default fetchApi;