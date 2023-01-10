import { NextApiRequest, NextApiResponse } from "next";
import * as os from "os";

type SystemMethods = Exclude<keyof MethodProcess<any>, ApiMethods>;
type QueryStruct = Partial<{ [key: string]: string | Array<string> }>;
type SessionStruct = { [key: string]: any };

export type ApiParameters = Partial<Record<ApiMethods, {
  req?: Array<DataItem>;
  res?: any;
}>>;
type Context<U extends keyof Api, M extends (ApiMethods | SystemMethods)> = {
  req: NextApiRequest;
  res: NextApiResponse;
  getCookies: <T extends QueryStruct = QueryStruct>() => T;
  getSession: () => SessionStruct;
  setStatus: (code: number) => void;
  hasError: () => boolean;
} & (
    M extends "get" ? {
      getQuery: <T extends (Exclude<PickApiParameter<Api, U, "get", "req", QueryStruct>, FormData> | Readonly<Array<DataItem>> | null | undefined) = Exclude<PickApiParameter<Api, U, "get", "req", QueryStruct>, FormData>>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => Partial<T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : T>;
    } : {
      getQuery: <T extends Readonly<Array<DataItem>> | null | undefined = undefined>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : QueryStruct;
      getBody: <T extends (Exclude<PickApiParameter<Api, U, Exclude<M, SystemMethods | "get">, "req">, FormData> | Readonly<Array<DataItem>> | null | undefined) = Exclude<PickApiParameter<Api, U, Exclude<M, SystemMethods | "get">, "req">, FormData>>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => Partial<T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : T>;
    }
  );

type MethodProcess<U extends keyof Api> = {
  preaction?: (context: Context<U, "preaction">) => Promise<void>;
  postaction?: (context: Context<U, "postaction">) => Promise<void>;
  get?: (context: Context<U, "get">) => Promise<void | Exclude<PickApiParameter<Api, U, "get", "res">, FormData>>;
  post?: (context: Context<U, "post">) => Promise<void | Exclude<PickApiParameter<Api, U, "post", "res">, FormData>>;
  put?: (context: Context<U, "put">) => Promise<void | Exclude<PickApiParameter<Api, U, "put", "res">, FormData>>;
  delete?: (context: Context<U, "delete">) => Promise<void | Exclude<PickApiParameter<Api, U, "delete", "res">, FormData>>;
};

const apiHandler = <U extends keyof Api>(methods: MethodProcess<U>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = (req.method?.toLocaleLowerCase() ?? "get") as ApiMethods;
    const handler = methods[method];
    if (handler == null) {
      res.status(404).json({});
      return;
    }

    let statusCode: number | undefined = undefined;
    const contentType = req.headers["content-type"]?.match(/([^\;]*)/)?.[1];
    const context: Context<U, typeof method> = {
      req,
      res,
      getQuery: (dataItems?: Readonly<Array<DataItem>>) => {
        if (!dataItems) return req.query;
        // TODO: convert to params / validaiton from parameterContexts
        console.log(dataItems);
        return req.query as any;
      },
      getBody: (dataItems?: Readonly<Array<DataItem>>) => {
        if (method === "get" || req.body == null) return undefined;
        if (contentType === "multipart/form-data" && typeof req.body === "string") {
          const key = req.body.match(/([^(?:\r?\n)]*)/)?.[0];
          if (key) {
            const body: { [key: string]: any } = {};
            req.body.split(key).forEach(item => {
              if (item.startsWith("--")) return;
              const lines = item.split(/\r?\n/);
              lines.splice(lines.length - 1, 1);
              lines.splice(0, 1);
              const name = lines[0]?.match(/\sname="([^\"]*)"/)?.[1];
              if (!name) return;
              const headerEndLineIndex = lines.findIndex(line => line === "");
              let value = lines.slice(headerEndLineIndex + 1).join(os.EOL) as any;
              if (headerEndLineIndex > 1) {
                if (value) {
                  value = {
                    fileName: lines[0]?.match(/\sfilename="([^\"]*)"/)?.[1],
                    contentType: lines[1].match(/Content-Type:\s([^\s|\r?\n|;]*)/)?.[1],
                    value,
                  };
                } else {
                  value = undefined;
                }
              }
              if (name in body) {
                if (!Array.isArray(body[name])) body[name] = [body[name]];
                body[name].push(value);
                return;
              }
              body[name] = value;
            });
            // TODO: validation from parameterContexts
            console.log(dataItems);
            return body;
          }
        }
        // TODO: validation from parameterContexts
        console.log(dataItems);
        return req.body;
      },
      getCookies: () => req.cookies as any,
      getSession: () => getSession(req, res),
      setStatus: (code: number) => statusCode = code,
      hasError: () => {
        // TODO: validation result check
        return false;
      },
    };

    try {
      await methods.preaction?.(context);
      const data = await handler(context as any);
      // TODO: error(ex. validation) handling, return error code
      await methods.postaction?.(context);
      if (data == null) {
        res.status(statusCode ?? 204).json({});
        return;
      }
      res.status(statusCode ?? 200).json(data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      res.status(500).json({});
      return;
    }
  };
};

const getSession = (req: NextApiRequest, _res: NextApiResponse): SessionStruct => {
  const session = (req as any).session;
  if (session) return session;
  return (global as any)._session ?? {};
};

export default apiHandler;