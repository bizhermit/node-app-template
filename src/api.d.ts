type AnyRequestParameter = FormData | string | Struct | undefined | null;
type AnyResponseParameter = string | Struct | undefined | null;

type ApiMethods = "get" | "put" | "post" | "delete";
type ApiDirection = "req" | "res";

type AbstractApi = {
  [key: string]: (
    Partial<Record<ApiMethods, Partial<Record<ApiDirection, any>>>> |
    Partial<Record<ApiMethods, any>> |
    any
  );
};

type PickApiParameter<A extends AbstractApi, Url extends keyof A, Method extends ApiMethods, Direction extends ApiDirection, Default = Direction extends "res" ? AnyResponseParameter : AnyRequestParameter> = (
  A[Url] extends Record<Method, any> ? (
    A[Url][Method] extends Record<Direction, any> ?
    A[Url][Method][Direction] : (
      Direction extends "res" ? A[Url][Method] : Default
    )
  ) : (
    Direction extends "res" ? A[Url] : Default
  )
);

type Api = {
  "/fetch": {
    get: {
      req: {
        hoge?: number;
        fuga: Array<number>;
      };
      res: null;
    };
    post: {
      res: {
        updated: boolean;
        body: null;
      };
    };
    put: {
      nodata: number;
    };
    delete: {
      req: {
        hoge: number;
      };
      res: {
        deleted: boolean;
      };
    };
  };
  "/fetch/[id]": any;
  "/notfound": {
    hoge: number;
  };
};