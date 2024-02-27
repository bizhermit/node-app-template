"use client";

import type { FC, ReactNode } from "react";
import equals from "../../../objects/equal";
import fetchApi, { type FetchApiFailedResponse, type FetchApiResponse, type FetchOptions } from "../../../utilities/fetch-api";
import useMessage from "../message";
import type { HookMessage, HookMessages } from "../message/context";
import useRouter from "../router";
import { FetchApiContext, type FetchHookOptions } from "./context";

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

const FetchApiProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
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
        if (result?.transition) {
          if (result.transition.type === "replace") router.replace(result.transition.pathname);
          else router.push(result.transition.pathname);
        }
      };

      if (
        (Array.isArray(message) ? message.length > 0 : message != null) &&
        !((Array.isArray(message) ? message[message.length - 1]?.quiet : message?.quiet) ?? result?.quiet ?? false)
      ) {
        msg.append(message, {
          checked: (() => {
            if (result?.transition == null && result?.finally == null) {
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
      const res = await fetchApi[method](url, params, options) as FetchApiResponse<Api.Response<U, M>> | FetchApiFailedResponse;
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

  return (
    <FetchApiContext.Provider value={{
      get: (url, params, options) => handle(url, "get", params, options),
      put: (url, params, options) => handle(url, "put", params, options),
      post: (url, params, options) => handle(url, "post", params, options),
      delete: (url, params, options) => handle(url, "delete", params, options),
    }}>
      {children}
    </FetchApiContext.Provider>
  );
};

export default FetchApiProvider;
