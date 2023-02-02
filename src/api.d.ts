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
      Method extends { req: infer Req } ? Req : RequestObject
    ) : RequestObject
  ) : RequestObject;

type ApiResponse<U extends ApiPath, M extends ApiMethods> =
  Api extends { [P in U]: infer Url } ? (
    Url extends { [P in M]: infer Method } ? (
      Method extends { res: infer Res } ? Res : (
        Method extends { req: any } ? null : Method
      )
    ) : ResponseObject
  ) : ResponseObject;

type _Api<A extends {
  [P in ApiPath]: {
    [M in ApiMethods]: MethodInterface;
  };
}> = A;

type ApiDataStruct<S extends DataContext, Strict extends boolean = false> = DataItemValueType<S, Strict>;

type ImportApi<T> = {
  [P in keyof T]: {
    get: {
      req: ApiDataStruct<T[P]["default"]["$get"]["req"], false>;
      res: ApiDataStruct<T[P]["default"]["$get"]["res"], true>;
    };
    put: {
      req: ApiDataStruct<T[P]["default"]["$put"]["req"], false>;
      res: ApiDataStruct<T[P]["default"]["$put"]["res"], true>;
    };
    post: {
      req: ApiDataStruct<T[P]["default"]["$post"]["req"], false>;
      res: ApiDataStruct<T[P]["default"]["$post"]["res"], true>;
    };
    delete: {
      req: ApiDataStruct<T[P]["default"]["$delete"]["req"], false>;
      res: ApiDataStruct<T[P]["default"]["$delete"]["res"], true>;
    };
  };
};

type Api = ImportApi<TypeofApi> & _Api<{
}>;