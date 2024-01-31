import { createContext } from "react";
import { type FetchApiFailedResponse, type FetchApiResponse, type FetchOptions } from "../../../utilities/fetch-api";
import type { HookMessage, ProviderMessage } from "../message/context";

export type FetchHookCallbackReturnType = {
  quiet?: boolean;
  transition?: {
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

export type FetchHookOptions<U extends ApiPath, M extends Api.Methods> = {
  succeeded?: (props: {
    res: FetchApiResponse<Api.Response<U, M>>;
    messages: Array<DI.ValidationResult>;
  }) => (void | FetchHookCallbackReturnType);
  failed?: (props?: {
    res: FetchApiFailedResponse;
    messages: Array<DI.ValidationResult>;
  }) => (void | FetchHookCallbackReturnType);
};

export type FetchApiContextProps<EndPoints extends ApiPath = ApiPath> = {
  get: <U extends EndPoints>(
    url: U,
    params?: Api.Request<U, "get"> | FormData,
    options?: FetchOptions & FetchHookOptions<U, "get">
  ) => Promise<FetchApiResponse<Api.Response<U, "get">>>;
  put: <U extends EndPoints>(
    url: U,
    params?: Api.Request<U, "put"> | FormData,
    options?: FetchOptions & FetchHookOptions<U, "put">
  ) => Promise<FetchApiResponse<Api.Response<U, "put">>>;
  post: <U extends EndPoints>(
    url: U,
    params?: Api.Request<U, "post"> | FormData,
    options?: FetchOptions & FetchHookOptions<U, "post">
  ) => Promise<FetchApiResponse<Api.Response<U, "post">>>;
  delete: <U extends EndPoints>(
    url: U,
    params?: Api.Request<U, "delete"> | FormData,
    options?: FetchOptions & FetchHookOptions<U, "delete">
  ) => Promise<FetchApiResponse<Api.Response<U, "delete">>>;
};

const throwMessage = "fetch api hook no initialized.";
export const FetchApiContext = createContext<FetchApiContextProps<ApiPath>>({
  get: () => {
    throw new Error(throwMessage);
  },
  post: () => {
    throw new Error(throwMessage);
  },
  put: () => {
    throw new Error(throwMessage);
  },
  delete: () => {
    throw new Error(throwMessage);
  },
});