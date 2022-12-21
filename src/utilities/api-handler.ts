import { NextApiRequest, NextApiResponse } from "next";

type QueryStruct = Partial<{ [key: string]: string | string[] }>;
type SessionStruct = { [key: string]: any };

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  getQuery: <T extends QueryStruct = QueryStruct>() => T;
  getBody: <T = Struct>() => T;
  getCookies: <T extends QueryStruct = QueryStruct>() => T;
  getSession: () => SessionStruct;
  setStatus: (code: number) => void;
};
type Handler = (context: Context) => Promise<void | Struct>;

type Methods = {
  common?: Handler;
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
} & { [key: string]: Handler };

const apiHandler = (methods: Methods) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLocaleLowerCase() ?? "get";

    let statusCode: number | undefined = undefined;
    const context: Context = {
      req,
      res,
      getQuery: () => req.query as any,
      getBody: () => req.body,
      getCookies: () => req.cookies as any,
      getSession: () => getSession(req, res),
      setStatus: (code: number) => statusCode = code,
    };

    const commonHandler = methods.common;
    if (commonHandler) {
      try {
        await commonHandler(context);
      } catch (e) {
        // console.log(e);
        res.status(500).json({});
        return;
      }
    }
    const handler = methods[method];
    if (handler == null) {
      res.status(404).json({});
      return;
    }

    try {
      const data = await handler(context);
      if (data == null) {
        res.status(statusCode ?? 204).json({});
        return;
      }
      res.status(statusCode ?? 200).json(data);
    } catch (e) {
      // console.log(e);
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