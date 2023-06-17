import useMessage from "#/components/providers/message/context";
import { equals } from "#/data-items/utilities";
import fetchApi, { FetchApiResponse, type FetchOptions } from "#/utilities/fetch-api";

const optimizeMessages = (messages: Array<Message>) => {
  const msgs: Array<Message> = [];
  messages.forEach(msg => {
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg == null) {
      msgs.push(msg);
      return;
    }
    if (!equals(lastMsg.title, msg.title) || lastMsg.type !== msg.type) {
      msgs.push(msg);
      return;
    }
    lastMsg.body = lastMsg.body + "\n" + msg.body;
  });
  return msgs;
};

const useFetch = () => {
  const msg = useMessage();

  const handle = async <U extends ApiPath, M extends ApiMethods>(
    url: U,
    method: M,
    params?: ApiRequest<U, M> | FormData,
    options?: FetchOptions
  ) => {
    try {
      const res = await fetchApi[method](url, params, options) as FetchApiResponse<ApiResponse<U, M>>;
      const msgs = optimizeMessages(res.messages);

      if (res.ok) {
        msg.append(msgs);
        return res;
      }

      if (msgs.filter(msg => msg.type === "error").length > 0) {
        msg.append(msgs);
      } else {
        msg.append({
          type: "error",
          title: "システムエラー",
          body: `[${res.status}] ${res.statusText}`,
        });
      }
    } catch (e) {
      msg.append({
        type: "error",
        title: "システムエラー",
        body: "fetch error"
      });
      throw e;
    }
    throw new Error("fetch api error.");
  };

  return {
    get: <U extends ApiPath>(url: U, params?: ApiRequest<U, "get"> | FormData, options?: FetchOptions) => {
      return handle(url, "get", params, options);
    },
    put: <U extends ApiPath>(url: U, params?: ApiRequest<U, "put"> | FormData, options?: FetchOptions) => {
      return handle(url, "put", params, options);
    },
    post: <U extends ApiPath>(url: U, params?: ApiRequest<U, "post"> | FormData, options?: FetchOptions) => {
      return handle(url, "post", params, options);
    },
    delete: <U extends ApiPath>(url: U, params?: ApiRequest<U, "delete"> | FormData, options?: FetchOptions) => {
      return handle(url, "delete", params, options);
    },
  };
};

export default useFetch;