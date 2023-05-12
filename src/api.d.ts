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
      req: DataItemValueType<T[P]["default"]["$get"], false>;
      res: {
        data: DataItemValueType<T[P]["default"]["get"], true>;
        messages: Array<DataItemValidationResult>;
      };
    };
    put: {
      req: DataItemValueType<T[P]["default"]["$put"], false>;
      res: {
        data: DataItemValueType<T[P]["default"]["put"], true>;
        messages: Array<DataItemValidationResult>;
      };
    };
    post: {
      req: DataItemValueType<T[P]["default"]["$post"], false>;
      res: {
        data: DataItemValueType<T[P]["default"]["post"], true>;
        messages: Array<DataItemValidationResult>;
      };
    };
    delete: {
      req: DataItemValueType<T[P]["default"]["$delete"], false>;
      res: {
        data: DataItemValueType<T[P]["default"]["delete"], true>;
        messages: Array<DataItemValidationResult>;
      };
    };
  };
};

type Api = ImportApi<TypeofApi> & _Api<{}>;

type Hoge = Api["/fetch"]["post"]["res"]["data"]