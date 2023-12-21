import { type RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { getItem, getReturnMessages, hasError } from "./main";

const getSession = (req: NextRequest): { [v: string | number | symbol]: any } => {
  return (req as any).session ?? (global as any)._session ?? {};
};

type MethodProcess<Req extends DataContext = DataContext, Res extends { [key: string]: any } | void = void> =
  (context: {
    req: NextRequest;
    getCookies: () => RequestCookies;
    getSession: () => { [v: string | number | symbol]: any };
    setStatus: (code: number) => void;
    hasError: () => boolean;
    getData: () => DataItemValueType<Req, true, "app-api">;
  }) => Promise<Res>;

const apiMethodHandler = <
  Req extends DataContext = DataContext,
  Res extends { [key: string]: any } | void = void
>(dataContext?: Req | null, process?: MethodProcess<Req, Res> | null) => {
  return (async (req: NextRequest, { params }) => {
    if (process == null) {
      return NextResponse.json({}, { status: 404 });
    }

    let statusCode: number | undefined = undefined;
    const msgs: Array<Message> = [];
    const method = (req.method.toLowerCase() ?? "get") as ApiMethods;

    try {
      const reqData = await (async () => {
        const data = await (async () => {
          const { searchParams } = new URL(req.url);
          const queryData: { [key: string]: any } = {};
          Array.from(searchParams.keys()).forEach(key => {
            queryData[key] = searchParams.get(key);
          });
          if (method === "get") {
            return {
              ...queryData,
              ...params,
            };
          }
          const contentType = req.headers.get("content-type") ?? "";
          if (/application\/json/.test(contentType)) {
            return {
              ...queryData,
              ...params,
              ...(await req.json()),
            };
          }
          const data: { [key: string]: any } = {
            ...queryData,
            ...params,
          };
          const formData = await req.formData();
          Array.from(formData.keys()).forEach(key => {
            data[key] = formData.get(key);
          });
          return data;
        })();
        if (dataContext == null) return data;
        getItem(msgs, {
          key: null!,
          dataItem: dataContext,
          data,
        });
        return data;
      })();

      if (hasError(msgs)) {
        statusCode = 422;
        throw new Error("validation error");
      }

      const resData = await process({
        req,
        getCookies: () => req.cookies,
        getSession: () => getSession(req),
        setStatus: (code: number) => statusCode = code,
        hasError: () => hasError(msgs),
        getData: () => reqData as any,
      });

      return NextResponse.json({
        messages: getReturnMessages(msgs),
        data: resData,
      }, {
        status: statusCode ?? resData == null ? 204 : 200,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return NextResponse.json({
        messages: getReturnMessages(msgs),
      }, {
        status: statusCode ?? 500,
      });
    }
  }) as {
    (req: NextRequest, ctx: { params: { [v: string]: string | Array<string> } }): Promise<NextResponse>;
    req: Req;
    res: Res;
  };
};

export default apiMethodHandler;