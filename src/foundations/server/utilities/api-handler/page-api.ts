import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { getItem, getReturnMessages, hasError } from "./main";

export type NextApiConfig = {
  api?: {
    bodyParser?: false | {
      sizeLimit?: string; // "10mb"
    };
    externalResolver?: boolean;
  };
};

const getSession = (req: NextApiRequest): SessionStruct => {
  return (req as any).session ?? (global as any)._session ?? {};
};

type MethodProcess<Req extends DataContext = DataContext, Res extends Struct | void = void> =
  (context: {
    req: NextApiRequest;
    res: NextApiResponse;
    getCookies: <T extends QueryStruct = QueryStruct>() => T;
    getSession: () => SessionStruct;
    setStatus: (code: number) => void;
    hasError: () => boolean;
    getData: () => DataItemValueType<Req, true, "page-api">;
  }) => Promise<Res>;

const apiHandler = <
  GetReq extends DataContext = DataContext,
  GetRes extends Struct | void = void,
  PostReq extends DataContext = DataContext,
  PostRes extends Struct | void = void,
  PutReq extends DataContext = DataContext,
  PutRes extends Struct | void = void,
  DeleteReq extends DataContext = DataContext,
  DeleteRes extends Struct | void = void
>(methods: Readonly<{
  $get?: GetReq;
  get?: MethodProcess<GetReq, GetRes>;
  $post?: PostReq;
  post?: MethodProcess<PostReq, PostRes>;
  $put?: PutReq;
  put?: MethodProcess<PutReq, PutRes>;
  $delete?: DeleteReq;
  delete?: MethodProcess<DeleteReq, DeleteRes>;
}>) => {
  return (async (req: NextApiRequest, res: NextApiResponse) => {
    let statusCode: number | undefined = undefined;
    const msgs: Array<Message> = [];

    try {
      const method = (req.method?.toLocaleLowerCase() ?? "get") as ApiMethods;
      const handler = methods[method];
      if (handler == null) {
        res.status(404).json({});
        return;
      }

      const dataContext = methods[`$${method}`];
      const reqData = await (async () => {
        let data: Struct = { ...req.query };
        const contentType = req.headers?.["content-type"]?.match(/([^\;]*)/)?.[1];
        if (req.body == null) {
          if (method !== "get") {
            await new Promise<void>((resolve, reject) => {
              const form = new formidable.IncomingForm({
                multiples: true,
              });
              form.parse(req, (err, fields, files) => {
                if (err) {
                  reject(err);
                  return;
                }
                data = {
                  ...data,
                  ...fields,
                  ...files,
                };
                resolve();
              });
            });
          }
        } else {
          if (contentType === "multipart/form-data") {
            const key = req.body.match(/([^(?:\r?\n)]*)/)?.[0];
            if (key) {
              const body: { [key: string]: any } = {};
              const items = (req.body as string).split(key);
              for (const item of items) {
                if (item.startsWith("--")) continue;
                const lines = item.split(/\r?\n/);
                lines.splice(lines.length - 1, 1);
                lines.splice(0, 1);
                const name = lines[0]?.match(/\sname="([^\"]*)"/)?.[1];
                if (!name) continue;
                let value: any = undefined;
                const headerEndLineIndex = lines.findIndex(line => line === "");
                const fileName = lines[0]?.match(/\sfilename="([^\"]*)"/)?.[1] ?? undefined;
                if (fileName == null) {
                  value = item
                    .replace(lines[0], "")
                    .replace(/^\r?\n\r?\n\r?\n/, "")
                    .replace(/\r?\n$/, "");
                } else {
                  if (headerEndLineIndex > 1) {
                    value = item
                      .replace(lines[0], "")
                      .replace(lines[1], "")
                      .replace(/^\r?\n\r?\n\r?\n\r?\n/, "")
                      .replace(/\r?\n$/, "");
                    if (fileName && value) {
                      value = {
                        mimetype: lines[1].match(/Content-Type:\s([^\s|\r?\n|;]*)/)?.[1],
                        originalFilename: fileName,
                        size: Buffer.from(value, "ascii").byteLength,
                        content: value,
                      } as FileValue<"page-api">;
                    } else {
                      value = undefined;
                    }
                  }
                }
                if (name in body) {
                  if (!Array.isArray(body[name])) body[name] = [body[name]];
                  body[name].push(value);
                  continue;
                }
                body[name] = value;
              }
              data = { ...data, ...body };
            }
          } else {
            data = { ...data, ...req.body };
          }
        }
        if (dataContext == null) return data;
        getItem(msgs, null, dataContext, data);
        return data;
      })();
      if (hasError(msgs)) {
        statusCode = 400;
        throw new Error("validation error");
      }

      const resData = await handler({
        req,
        res,
        getCookies: () => req.cookies as any,
        getSession: () => getSession(req),
        setStatus: (code: number) => statusCode = code,
        hasError: () => hasError(msgs),
        getData: () => reqData as any,
      });

      res.status(statusCode ?? (resData == null ? 204 : 200)).json({
        messages: getReturnMessages(msgs),
        data: resData
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      res.status(statusCode ?? 500).json({
        messages: getReturnMessages(msgs),
      });
    }
  }) as {
    (req: NextApiRequest, res: NextApiResponse): Promise<void>;
    $get: GetReq;
    get: GetRes;
    $post: PostReq;
    post: PostRes;
    $put: PutReq;
    put: PutRes;
    $delete: DeleteReq;
    delete: DeleteRes;
  };
};

export default apiHandler;