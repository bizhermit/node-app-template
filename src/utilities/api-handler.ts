import { NextApiRequest, NextApiResponse } from "next";
import * as os from "os";

type SystemMethods = Exclude<keyof MethodProcess<any>, ApiMethods>;

type DefaultQueryStruct = Partial<{ [key: string]: string | Array<string> }>;
type QueryParameter<A extends Api, U extends keyof A> = {
  [P in keyof Exclude<PickApiParameter<A, U, Exclude<"get", SystemMethods>, "req">, FormData>]:
  Exclude<PickApiParameter<A, U, Exclude<"get", SystemMethods>, "req">, FormData>[P] extends Array<any> ? string | Array<string> : string
};
type SessionStruct = { [key: string]: any };

type Context<U extends keyof Api, M extends (ApiMethods | SystemMethods)> = {
  req: NextApiRequest;
  res: NextApiResponse;
  getQuery: <T extends DefaultQueryStruct = M extends "get" ? QueryParameter<Api, U> : DefaultQueryStruct>() => T;
  getBody: <T = M extends "get" ? null : Exclude<PickApiParameter<Api, U, Exclude<M, SystemMethods>, "req">, FormData>>() => T;
  getCookies: <T extends DefaultQueryStruct = DefaultQueryStruct>() => T;
  getSession: () => SessionStruct;
  setStatus: (code: number) => void;
};
type Handler<U extends keyof Api, M extends (ApiMethods | SystemMethods)> =
  (context: Context<U, M>) => Promise<
    void | Struct
    | Exclude<PickApiParameter<Api, U, Exclude<M, SystemMethods>, "res">, FormData>
  >;

type MethodProcess<U extends keyof Api> = {
  preaction?: Handler<U, "preaction">;
  postaction?: Handler<U, "postaction">;
  get?: Handler<U, "get">;
  post?: Handler<U, "post">;
  put?: Handler<U, "put">;
  delete?: Handler<U, "delete">;
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
      getQuery: () => req.query as any,
      getBody: () => {
        if (req.body == null) return undefined;
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
            return body;
          }
        }
        return req.body;
      },
      getCookies: () => req.cookies as any,
      getSession: () => getSession(req, res),
      setStatus: (code: number) => statusCode = code,
    };

    try {
      await methods.preaction?.(context);
      const data = await handler(context);
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