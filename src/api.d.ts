type AnyRequestParameter = FormData | string | Struct | undefined | null;
type AnyResponseParameter = string | Struct | undefined | null;

type ApiMethods = "get" | "put" | "post" | "delete";
type ApiDirection = "req" | "res";

type RequestObject<T extends Struct | FormData> = T extends Struct | FormData ? T : Struct | FormData;
type ResponseObject<T extends Object = Object> = T extends null | undefined | unknown ? Struct : T;
type MethodInterface = {
  req: RequestObject;
  res: ResponseObject;
} | ResponseObject;

type ApiRequest<U extends ApiPath, M extends ApiMethods> =
  Api extends { [P in U]: infer Url } ? (
    Url extends { [P in M]: infer Method } ? (
      Method extends { req: infer Obj } ? Obj : RequestObject
    ) : RequestObject
  ) : RequestObject;

type ApiResponse<U extends ApiPath, M extends ApiMethods> =
  Api extends { [P in U]: infer Url } ? (
    Url extends { [P in M]: infer Method } ? (
      Method extends { res: infer Obj } ? Obj : (
        Method extends { req: any } ? null : Method
      )
    ) : ResponseObject
  ) : ResponseObject;

type _Api<A extends {
  [P in ApiPath]: {
    [M in ApiMethods]: MethodInterface;
  };
}> = A;

type $Api<T> = {
  get: {
    req: DataItemStruct<T["GetReq"]>;
    res: T["GetRes"];
  };
  put: {
    req: DataItemStruct<T["PutReq"]>;
    res: T["PutRes"];
  };
  post: {
    req: DataItemStruct<T["PostReq"]>;
    res: T["PostRes"];
  };
  delete: {
    req: DataItemStruct<T["DeleteReq"]>;
    res: T["DeleteRes"];
  };
};

type Api = _Api<{
  // "/fetch": {
  //   get: {
  //     req: {
  //       hoge?: number;
  //       fuga: Array<number>;
  //     };
  //     res: null;
  //   };
  //   post: {
  //     res: {
  //       updated: boolean;
  //       body: null;
  //     };
  //   };
  //   put: {
  //     nodata: number;
  //   };
  //   delete: {
  //     req: {
  //       hoge: number;
  //     };
  //     res: {
  //       deleted: boolean;
  //     };
  //   };
  // };
  // "/fetch/[id]": {
  // };
  // "/formfg": {
  // }
  "/fetch": $Api<typeof import("@/pages/api/fetch/index")>;
}>;