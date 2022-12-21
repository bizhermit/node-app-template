import { RequestInit } from "next/dist/server/web/spec-extension/request";

const electron = (global as any).electron;

type MethodArgs = {
  request?: Struct | FormData;
  response?: Struct;
};

export type ApiPaths = {
  [key: string]: {
    get?: MethodArgs;
    post?: MethodArgs;
    put?: MethodArgs;
    delete?: MethodArgs;
  };
};

const crossFetch = (url: string, init?: RequestInit) => {
  if (electron) return electron.fetch(url, init);
  return fetch(url, init);
};

export default crossFetch;