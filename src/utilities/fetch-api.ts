import { getDynamicUrlContext } from "@/utilities/url";
import type { RequestInit } from "next/dist/server/web/spec-extension/request";

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
  const contentType = options?.contentType ?? "json";
  if (contentType === "formData") {
    return {
      body: (() => {
        if (params instanceof FormData) return params;
        const fd = new FormData();
        if (params == null || !isValidBodyParams(params)) return fd;
        Object.keys(params).forEach(key => {
          const v = params[key];
          if (v == null) return;
          fd.append(key, JSON.stringify(v));
        });
      })(),
    };
  }
  return {
    body: (() => {
      if (params instanceof FormData) {
        const struct: { [key: string]: any } = {};
        Array.from(params.keys()).forEach(key => {
          const v = params.get(key);
          if (v == null) return;
          struct[key] = v;
        });
        return JSON.stringify(struct);
      }
      if (!isValidBodyParams(params)) return "{}";
      return JSON.stringify(params);
    })(),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
};

const update = <T>(url: ApiPath, method: ApiMethods, params: any = undefined, options?: FetchOptions) => {
  const ctx = getDynamicUrlContext(url, params);
  return crossFetch<T>(`/api${ctx.url}`, {
    method,
    ...convertToRequestInit(ctx.data, options),
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