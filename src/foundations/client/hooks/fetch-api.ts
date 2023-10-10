import { equals } from "../../data-items/utilities";
import fetchApi, { type FetchApiResponse, type FetchOptions } from "../../utilities/fetch-api";
import useMessage, { type ProviderMessage } from "../providers/message/context";

type FetchHookOptions<U extends ApiPath, M extends ApiMethods> = {
  messageChecked?: (ctx: {
    res: FetchApiResponse<ApiResponse<U, M>> | undefined;
    message: ProviderMessage;
    value: any;
  }) => void;
};

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
    options?: FetchOptions & FetchHookOptions<U, M>
  ) => {
    const getMsgChecked = (res?: FetchApiResponse<ApiResponse<U, M>>) => {
      return (value: any, message: ProviderMessage) => options?.messageChecked?.({ res, message, value });
    };

    try {
      const res = await fetchApi[method](url, params, options) as FetchApiResponse<ApiResponse<U, M>>;
      const msgs = optimizeMessages(res.messages);

      if (res.ok) {
        msg.append(msgs, {
          checked: getMsgChecked(res),
        });
        return res;
      }

      if (msgs.filter(msg => msg.type === "error").length > 0) {
        msg.append(msgs, {
          checked: getMsgChecked(res),
        });
      } else {
        msg.append({
          type: "error",
          title: "システムエラー",
          body: `[${res.status}] ${res.statusText}`,
          checked: getMsgChecked(res),
        });
      }
    } catch (e) {
      msg.append({
        type: "error",
        title: "システムエラー",
        body: "fetch error",
        checked: getMsgChecked(),
      });
      throw e;
    }
    throw new Error("fetch api error.");
  };

  return {
    get: <U extends ApiPath>(
      url: U,
      params?: ApiRequest<U, "get"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "get">
    ) => {
      return handle(url, "get", params, options);
    },
    put: <U extends ApiPath>(
      url: U,
      params?: ApiRequest<U, "put"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "put">
    ) => {
      return handle(url, "put", params, options);
    },
    post: <U extends ApiPath>(
      url: U,
      params?: ApiRequest<U, "post"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "post">
    ) => {
      return handle(url, "post", params, options);
    },
    delete: <U extends ApiPath>(
      url: U,
      params?: ApiRequest<U, "delete"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "delete">
    ) => {
      return handle(url, "delete", params, options);
    },
  };
};

export default useFetch;