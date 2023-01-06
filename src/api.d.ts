type AnyRequestParameter = FormData | string | Struct | undefined | null;
type AnyResponseParameter = string | Struct | undefined | null;

type ApiMethods = "get" | "put" | "post" | "delete";
type ApiParameters = "req" | "res";

type AbstractApi = {
  [key: string]: (
    Partial<Record<ApiMethods, Partial<Record<ApiParameters, any>>>> |
    Partial<Record<ApiMethods, any>> |
    any
  );
};

type PickApiParameter<A extends AbstractApi, Url extends keyof A, Method extends ApiMethods, Direction extends ApiParameters> = (
  A[Url] extends Record<Method, any> ? (
    A[Url][Method] extends Record<Direction, any> ?
    A[Url][Method][Direction] : (
      Direction extends "res" ? A[Url][Method] : AnyRequestParameter
    )
  ) : (
    Direction extends "res" ? A[Url] : AnyRequestParameter
  )
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
    put: {
      nodata: number;
    };
    delete: {
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