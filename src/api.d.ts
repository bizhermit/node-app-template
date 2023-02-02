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

type RequestDataContext = { [key: string]: DataItem | RequestDataContext };

type ApiRequestDataStruct<S extends RequestDataContext | unknown, Strict extends boolean = false> = {
  [P in keyof S]: DataItemValueType<S[P], Strict>;
};

type ResponseDataContext = {};

type ApiResponseDataStruct<T extends ResponseDataContext | unknown> = T;

type ImportApi<T> = {
  get: {
    req: ApiRequestDataStruct<T["default"]["$get"]["req"]>;
    res: T["GetRes"];
  };
  put: {
    req: ApiRequestDataStruct<T["default"]["$put"]["req"]>;
    res: T["PutRes"];
  };
  post: {
    req: ApiRequestDataStruct<T["default"]["$post"]["req"]>;
    res: T["PostRes"];
  };
  delete: {
    req: ApiRequestDataStruct<T["default"]["$delete"]["req"]>
    res: T["DeleteRes"];
  };
};

type Api = _Api<{
  "/fetch": ImportApi<typeof import("@/pages/api/fetch/index")>;
  "/fetch/[id]": ImportApi<typeof import("@/pages/api/fetch/[id]")>;
  // "/fetch/[id]": {
  //   get: {
  //     req: {
  //       hoge: number;
  //       fuga: Array<string>;
  //     };
  //     res: {
  //       completed: boolean;
  //     };
  //   };
  // };
}>;