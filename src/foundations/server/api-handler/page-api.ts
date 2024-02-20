import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import nextAuthOptions from "../../auth/options";
import { acceptData, getReturnMessages, hasError } from "./main";

export type NextApiConfig = {
  api?: {
    bodyParser?: false | {
      sizeLimit?: string; // "10mb"
    };
    externalResolver?: boolean;
  };
};

type MethodProcess<Req extends Api.RequestDataItems = Api.RequestDataItems, Res extends { [v: string]: any } | void = void> =
  (context: {
    req: NextApiRequest;
    res: NextApiResponse;
    user: SignInUser | undefined;
    getCookies: <T extends { [v: string]: string | Array<string> } = { [v: string]: string | Array<string> }>() => T;
    setStatus: (code: number) => void;
    hasError: () => boolean;
    getData: () => DI.VType<Req, true, "page-api">;
  }) => Promise<Res>;

const apiHandler = <
  GetReq extends Api.RequestDataItems = Api.RequestDataItems,
  GetRes extends { [v: string]: any } | void = void,
  PostReq extends Api.RequestDataItems = Api.RequestDataItems,
  PostRes extends { [v: string]: any } | void = void,
  PutReq extends Api.RequestDataItems = Api.RequestDataItems,
  PutRes extends { [v: string]: any } | void = void,
  DeleteReq extends Api.RequestDataItems = Api.RequestDataItems,
  DeleteRes extends { [v: string]: any } | void = void
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
    const msgs: Array<Api.Message> = [];

    try {
      const session = await getServerSession(req, res, nextAuthOptions);

      const method = (req.method?.toLocaleLowerCase() ?? "get") as Api.Methods;
      const handler = methods[method];
      if (handler == null) {
        res.status(404).json({});
        return;
      }

      const dataItems = methods[`$${method}`];
      const reqData = await (async () => {
        let data: { [v: string]: any } = { ...req.query };
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
              const body: { [v: string]: any } = {};
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
        if (dataItems == null) return data;
        acceptData(msgs, data, dataItems);
        return data;
      })();
      if (hasError(msgs)) {
        statusCode = 422;
        throw new Error("validation error");
      }

      const resData = await handler({
        req,
        res,
        user: session?.user,
        getCookies: () => req.cookies as any,
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
    $get: DI.VType<GetReq, false, "client">;
    get: GetRes;
    $post: DI.VType<PostReq, false, "client">;
    post: PostRes;
    $put: DI.VType<PutReq, false, "client">;
    put: PutRes;
    $delete: DI.VType<DeleteReq, false, "client">;
    delete: DeleteRes;
  };
};

export default apiHandler;
