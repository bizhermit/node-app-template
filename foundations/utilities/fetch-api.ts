import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import { convertFormDataToStruct, convertStructToFormData } from "./form-data";
import { getDynamicUrlContext } from "./url";

export type FetchOptions = {
  contentType?: "json" | "formData";
};
export type FetchApiResponse<T> = {
  ok: boolean;
  status: number;
  statusText: string;
  messages: Array<Message>;
  data: T;
};

const electron = (global as any).electron;

const toJson = <T>(text: string | null | undefined): { data: T; messages: Array<Message> } => {
  if (text == null) return {
    messages: [],
    data: undefined as T,
  };
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

const handleResponse = <T>(
  ok: boolean,
  status: number,
  statusText: string | null | undefined,
  text: string | null | undefined
): FetchApiResponse<T> => {
  const json = toJson(text);
  return {
    ok,
    status,
    statusText: statusText || "",
    messages: json.messages ?? [],
    data: (status === 204 ? undefined : json.data) as T,
  };
};

const fetchElectron = async <T>(url: string, init?: RequestInit) => {
  const res = await electron.fetch(url, init);
  return handleResponse<T>(res.ok as boolean, res.status, res.statusText as string, res.text);
};

const fetchServer = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  return handleResponse<T>(res.ok, res.status, res.statusText, await res.text());
};

const crossFetch = async <T>(url: string, init?: RequestInit) => {
  if (electron) return fetchElectron<T>(url, init);
  return fetchServer<T>(url, init);
};

const isValidBodyParams = (params?: any) => {
  if (params == null) return true;
  const t = typeof params;
  return !(t === "string" || t === "bigint" || t === "number" || t === "boolean");
};

const convertToRequestInit = (params?: any, options?: FetchOptions): RequestInit => {
  const contentType = electron ? "json" : options?.contentType ?? "json";
  if (contentType === "formData") {
    return {
      body: (() => {
        if (params instanceof FormData) return params;
        if (params == null || !isValidBodyParams(params)) return new FormData();
        return convertStructToFormData(params, { removeItem: "null" });
      })(),
    };
  }
  return {
    body: (() => {
      if (params instanceof FormData) {
        return JSON.stringify(convertFormDataToStruct(params, { removeItem: "null" }));
      }
      if (!isValidBodyParams(params)) return "{}";
      return JSON.stringify(params);
    })(),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
};

const update = <U extends ApiPath, M extends ApiMethods>(url: U, method: M, params: any = undefined, options?: FetchOptions) => {
  const ctx = getDynamicUrlContext(url, params);
  return crossFetch<ApiResponse<U, M>>(ctx.url, {
    method,
    ...convertToRequestInit(ctx.data, options),
  });
};

const fetchApi = {
  get: <U extends ApiPath>(url: U, params?: ApiRequest<U, "get"> | FormData, _options?: FetchOptions) => {
    const ctx = getDynamicUrlContext(url, params, { appendQuery: true, queryArrayIndex: true });
    return crossFetch<ApiResponse<U, "get">>(ctx.url, { method: "GET" });
  },
  put: <U extends ApiPath>(url: U, params?: ApiRequest<U, "put"> | FormData, options?: FetchOptions) => {
    return update(url, "put", params, options);
  },
  post: <U extends ApiPath>(url: U, params?: ApiRequest<U, "post"> | FormData, options?: FetchOptions) => {
    return update(url, "post", params, options);
  },
  delete: <U extends ApiPath>(url: U, params?: ApiRequest<U, "delete"> | FormData, options?: FetchOptions) => {
    return update(url, "delete", params, options);
  },
};

export default fetchApi;