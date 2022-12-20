import { NextApiRequest, NextApiResponse } from "next";

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  getBody: <T = Struct>() => T;
  getQuery: () => Partial<{ [key: string]: string | string[] }>;
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
      getQuery: () => req.query,
      getBody: () => req.body,
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

export default apiHandler;