type Message = DataItemValidationResult;

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

type ImportApi<T extends TypeofApi> = {
  [P in keyof T]: {
    get: {
      req: DataItemValueType<P extends AppApiPath ? T[P]["GET"]["req"] : T[P]["default"]["$get"], false>;
      res: DataItemValueType<P extends AppApiPath ? T[P]["GET"]["res"] : T[P]["default"]["get"], true>;
    };
    put: {
      req: DataItemValueType<P extends AppApiPath ? T[P]["PUT"]["req"] : T[P]["default"]["$put"], false>;
      res: DataItemValueType<P extends AppApiPath ? T[P]["PUT"]["res"] : T[P]["default"]["put"], true>;
    };
    post: {
      req: DataItemValueType<P extends AppApiPath ? T[P]["POST"]["req"] : T[P]["default"]["$post"], false>;
      res: DataItemValueType<P extends AppApiPath ? T[P]["POST"]["res"] : T[P]["default"]["post"], true>;
    };
    delete: {
      req: DataItemValueType<P extends AppApiPath ? T[P]["DELETE"]["req"] : T[P]["default"]["$delete"], false>;
      res: DataItemValueType<P extends AppApiPath ? T[P]["DELETE"]["res"] : T[P]["default"]["delete"], true>;
    };
  };
};

type Api = ImportApi<TypeofApi> & _Api<{
  // custom api endpoints
}>;

type ApiPath = keyof Api;