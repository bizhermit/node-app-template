import useMessage from "@/components/providers/message";
import { equals } from "@/data-items/utilities";
import fetchApi, { FetchApiResponse, FetchOptions } from "@/utilities/fetch-api";

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

  const handle = <T extends FetchApiResponse<any>>(res: T): T => {
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
    // throw new Error("fetch api failed.");
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