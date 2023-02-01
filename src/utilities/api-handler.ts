import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { NextApiRequest, NextApiResponse } from "next";
import * as os from "os";

type SystemMethods = Exclude<keyof MethodProcess<any>, ApiMethods>;
type QueryStruct = Partial<{ [key: string]: string | Array<string> }>;
type SessionStruct = { [key: string]: any };

type Context<U extends ApiPath, M extends (ApiMethods | SystemMethods)> = {
  req: NextApiRequest;
  res: NextApiResponse;
  getCookies: <T extends QueryStruct = QueryStruct>() => T;
  getSession: () => SessionStruct;
  setStatus: (code: number) => void;
  hasError: () => boolean;
  getArgs: <T extends RequestDataContext>(dataContext?: T)
    => T extends unknown ? ApiRequest<U, Exclude<M, SystemMethods>> : ApiRequestDataStruct<T>;
};
// &(
//   M extends "get" ? {
//     getQuery: <T extends (Exclude<ApiRequest<U, "get">, FormData> | Readonly<Array<DataItem>> | null | undefined) = Exclude<ApiRequest<U, "get">, FormData>>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => Partial<T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : T>;
//   } : {
//     getQuery: <T extends Readonly<Array<DataItem>> | null | undefined = undefined>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : QueryStruct;
//     getBody: <T extends (Exclude<ApiRequest<U, Exclude<M, SystemMethods | "get">>, FormData> | Readonly<Array<DataItem>> | null | undefined) = Exclude<ApiRequest<U, Exclude<M, SystemMethods | "get">>, FormData>>(dataItems?: T extends Readonly<Array<DataItem>> ? T : undefined) => Partial<T extends Readonly<Array<DataItem>> ? DataItemStruct<T> : T>;
//   }
// );;

type MethodProcess<U extends ApiPath> = {
  preaction?: (context: Context<U, "preaction">) => Promise<void>;
  postaction?: (context: Context<U, "postaction">) => Promise<void>;
  get?: (context: Context<U, "get">) => Promise<void | Exclude<ApiResponse<U, "get">, FormData>>;
  post?: (context: Context<U, "post">) => Promise<void | Exclude<ApiResponse<U, "post">, FormData>>;
  put?: (context: Context<U, "put">) => Promise<void | Exclude<ApiResponse<U, "put">, FormData>>;
  delete?: (context: Context<U, "delete">) => Promise<void | Exclude<ApiResponse<U, "delete">, FormData>>;
};

type MessageContext = DataItemValidationResult;

const getStringItem = (msgs: Array<MessageContext>, key: string, ctx: DataItem_String, data?: Struct) => {
  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as string | undefined;
  if (ctx.required && StringUtils.isEmpty(v)) {
    msgs.push({ type: "error", name: key, body: `${ctx.label || ctx.name}を入力してください` });
  }
  if (ctx.length != null && StringUtils.length(v) !== ctx.length) {
    msgs.push({ type: "error", name: key, body: `${ctx.label || ctx.name}は${ctx.length}文字で入力してください` });
  }
  if (ctx.minLength != null && StringUtils.length(v) < ctx.minLength) {
    msgs.push({ type: "error", name: key, body: `${ctx.label || ctx.name}は${ctx.minLength}文字以上で入力してください` });
  }
  if (ctx.maxLength != null && StringUtils.length(v) > ctx.maxLength) {
    msgs.push({ type: "error", name: key, body: `${ctx.label || ctx.name}は${ctx.maxLength}文字以下で入力してください` });
  }
  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data);
      if (res) msgs.push(res);
    }
  }
};

const apiHandler = <U extends ApiPath>(methods: MethodProcess<U>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = (req.method?.toLocaleLowerCase() ?? "get") as ApiMethods;
    const handler = methods[method];
    if (handler == null) {
      res.status(404).json({});
      return;
    }

    let statusCode: number | undefined = undefined;
    const contentType = req.headers["content-type"]?.match(/([^\;]*)/)?.[1];
    let args: any = null;
    const msgs: Array<MessageContext> = [];
    const context: Context<U, typeof method> = {
      req,
      res,
      getArgs: (dataContext) => {
        if (args != null) return args;
        let retData: Struct = { ...req.query };
        if (req.body != null) {
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
              retData = { ...retData, ...body };
            }
          } else {
            retData = { ...retData, ...req.body };
          }
        }
        if (dataContext == null) return args = retData;
        const impl = (ctx?: RequestDataContext, data?: any) => {
          if (ctx == null) return;
          Object.keys(ctx).forEach(key => {
            const c = ctx[key] as DataItem;
            const d = data[key];
            if (!("$$" in c)) {
              impl(c, d);
              return;
            }
            switch (c.type) {
              case "string":
                getStringItem(msgs, key, c, d);
                break;
              case "number":
                // TODO: validation
                break;
              case "boolean":
                // TODO: validation
                break;
              case "date":
                // TODO: validation
                break;
              case "month":
                // TODO: validation
                break;
              case "array":
                // TODO: validation
                break;
              default:
                break;
            }
          });
        };
        impl(dataContext, retData);
        console.log("messages: ", msgs);
        return args = retData;
      },
      getCookies: () => req.cookies as any,
      getSession: () => getSession(req, res),
      setStatus: (code: number) => statusCode = code,
      hasError: () => {
        return msgs.some(msg => msg.type === "error");
      },
    };

    try {
      await methods.preaction?.(context);
      const data = await handler(context as any);
      await methods.postaction?.(context);
      // TODO: set messages
      if (data == null) {
        res.status(statusCode ?? 204).json({});
        return;
      }
      res.status(statusCode ?? 200).json(data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      // TODO: set messages
      res.status(500).json({});
      return;
    }
  };
};

const getSession = (req: NextApiRequest, _res: NextApiResponse): SessionStruct => {
  return (req as any).session ?? (global as any)._session ?? {};
};

export default apiHandler;