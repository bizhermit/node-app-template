import useRouter from "#/client/hooks/router";
import equals from "../../objects/equal";
import fetchApi, { type FetchApiResponse, type FetchOptions } from "../../utilities/fetch-api";
import useMessage, { type HookMessage, type HookMessages, type ProviderMessage } from "../providers/message/context";

type FetchHookCallbackReturnType = {
  quiet?: boolean;
  redirect?: {
    pathname: PagePath;
    type?: "push" | "replace";
  };
  message?: HookMessage;
  messageChecked?: (props: {
    message: ProviderMessage;
    value: any;
  }) => Promise<void>;
  finally?: () => void;
};

type FetchHookOptions<U extends ApiPath, M extends Api.Methods> = {
  succeeded?: (props: {
    res: FetchApiResponse<Api.Response<U, M>>;
    messages: Array<DI.ValidationResult>;
  }) => (void | FetchHookCallbackReturnType);
  failed?: (props?: {
    res: FetchApiResponse<Api.Response<U, M>>;
    messages: Array<DI.ValidationResult>;
  }) => (void | FetchHookCallbackReturnType);
};

const optimizeMessages = (messages: Array<Api.Message>) => {
  const msgs: Array<Api.Message> = [];
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
  const router = useRouter();

  const handle = async <U extends ApiPath, M extends Api.Methods>(
    url: U,
    method: M,
    params?: Api.Request<U, M> | FormData,
    options?: FetchOptions & FetchHookOptions<U, M>
  ) => {
    const callback = (result: ReturnType<Exclude<FetchHookOptions<any, any>["succeeded" | "failed"], undefined>> | undefined, defaultMessage: () => HookMessages) => {
      const message = (result != null && "message" in result) ? result.message : defaultMessage();

      const then = () => {
        result?.finally?.();
        if (result?.redirect) {
          if (result.redirect.type === "replace") router.replace(result.redirect.pathname);
          else router.push(result.redirect.pathname);
        }
      };

      if (
        (Array.isArray(message) ? message.length > 0 : message != null) &&
        !((Array.isArray(message) ? message[message.length - 1]?.quiet : message?.quiet) ?? result?.quiet ?? false)
      ) {
        msg.append(message, {
          checked: (() => {
            if (result?.redirect == null && result?.finally == null) {
              return result?.messageChecked;
            }
            return async (value, message) => {
              await result?.messageChecked?.({ message, value });
              then();
            };
          })() as HookMessage["checked"],
          quiet: result?.quiet,
        });
        return;
      }
      then();
    };

    try {
      const res = await fetchApi[method](url, params, options) as FetchApiResponse<Api.Response<U, M>>;
      const messages = optimizeMessages(res.messages);

      if (res.ok) {
        callback(
          options?.succeeded?.({ res, messages }),
          () => messages
        );
        return res;
      }

      callback(
        options?.failed?.({ res, messages }),
        () => messages.filter(msg => msg.type === "error").length > 0 ? messages : {
          type: "error",
          title: "システムエラー",
          body: `[${res.status}] ${res.statusText}`,
        }
      );
    } catch (e) {
      callback(
        options?.failed?.(),
        () => ({
          type: "error",
          title: "システムエラー",
          body: "fetch error",
        })
      );
      throw e;
    }
    throw new Error("fetch api error.");
  };

  return {
    get: <U extends ApiPath>(
      url: U,
      params?: Api.Request<U, "get"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "get">
    ) => {
      return handle(url, "get", params, options);
    },
    put: <U extends ApiPath>(
      url: U,
      params?: Api.Request<U, "put"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "put">
    ) => {
      return handle(url, "put", params, options);
    },
    post: <U extends ApiPath>(
      url: U,
      params?: Api.Request<U, "post"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "post">
    ) => {
      return handle(url, "post", params, options);
    },
    delete: <U extends ApiPath>(
      url: U,
      params?: Api.Request<U, "delete"> | FormData,
      options?: FetchOptions & FetchHookOptions<U, "delete">
    ) => {
      return handle(url, "delete", params, options);
    },
  };
};

export default useFetch;