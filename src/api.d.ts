type AnyParameter = FormData | string | Struct | undefined | null;

type ApiParameters = "req" | "res";
type ApiMethods = "get" | "put" | "post" | "delete";

type AbstractApi = { [key: string]: Partial<Record<ApiMethods, Partial<Record<ApiParameters, any>>>> };

type PickApiParameter<A extends AbstractApi, Url extends string, Method extends string, Direction extends "req" | "res"> =
  (A[Url] extends Record<Method, any> ?
    (A[Url][Method] extends Record<Direction, any> ?
      A[Url][Method][Direction] :
      AnyParameter
    ) :
    AnyParameter
  );

type Api = {
  "/fetch": {
    get: {
      req: {
        hoge: number;
      };
      res: null;
    };
    post: {
      req: null;
      res: {
        updated: boolean;
        body: null;
      };
    };
    delete: {
      res: {
        deleted: boolean;
      };
    };
  };
  "/fetch/[id]": any;
};