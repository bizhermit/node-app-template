import useMessage from "@/components/providers/message";
import fetchApi, { FetchApiResponse, FetchOptions } from "@/utilities/fetch-api";

const useFetch = () => {
  const msg = useMessage();

  const handle = <T extends FetchApiResponse<any>>(res: T): T => {
    msg.append(res.messages);
    return res;
  };

  return {
    get: async <U extends ApiPath>(url: U, params?: ApiRequest<U, "get"> | FormData, options?: FetchOptions) => {
      return handle(await fetchApi.get<U>(url, params, options));
    },
    put: async <U extends ApiPath>(url: U, params?: ApiRequest<U, "put"> | FormData, options?: FetchOptions) => {
      return handle(await fetchApi.put<U>(url, params, options));
    },
    post: async <U extends ApiPath>(url: U, params?: ApiRequest<U, "post"> | FormData, options?: FetchOptions) => {
      return handle(await fetchApi.post<U>(url, params, options));
    },
    delete: async <U extends ApiPath>(url: U, params?: ApiRequest<U, "delete"> | FormData, options?: FetchOptions) => {
      return handle(await fetchApi.delete<U>(url, params, options));
    },
  };
};

export default useFetch;