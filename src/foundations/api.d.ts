declare namespace Api {

  type Message = DI.ValidationResult;

  type Methods = "get" | "put" | "post" | "delete";

  type RequestObject<T extends { [v: string]: any } | FormData> =
    T extends { [v: string]: any } | FormData ? T : { [v: string]: any } | FormData;

  type ResponseObject<T extends Object = Object> = T extends null | undefined | unknown ? { [v: string]: any } : T;

  type MethodInterface = { req: Api.RequestObject; res: Api.ResponseObject; } | Api.ResponseObject;

  type Request<U extends ApiPath, M extends Api.Methods> =
    ApiContext extends { [P in U]: infer Url } ? (
      Url extends { [P in M]: infer Method } ? (
        Method extends { req: infer Req } ? Req : Api.RequestObject
      ) : Api.RequestObject
    ) : Api.RequestObject;

  type Response<U extends ApiPath, M extends Api.Methods> =
    ApiContext extends { [P in U]: infer Url } ? (
      Url extends { [P in M]: infer Method } ? (
        Method extends { res: infer Res } ? Res : (
          Method extends { req: any } ? null : Method
        )
      ) : Api.ResponseObject
    ) : Api.ResponseObject;

  type RequestDataItems = Array<DataItem>;

  type Import<T extends TypeofApi> = {
    [P in keyof T]: {
      get: {
        req: P extends keyof TypeofAppApi ? T[P]["GET"]["req"] : T[P]["default"]["$get"];
        res: P extends keyof TypeofAppApi ? T[P]["GET"]["res"] : T[P]["default"]["get"];
      };
      put: {
        req: P extends keyof TypeofAppApi ? T[P]["PUT"]["req"] : T[P]["default"]["$put"];
        res: P extends keyof TypeofAppApi ? T[P]["PUT"]["res"] : T[P]["default"]["put"];
      };
      post: {
        req: P extends keyof TypeofAppApi ? T[P]["POST"]["req"] : T[P]["default"]["$post"];
        res: P extends keyof TypeofAppApi ? T[P]["POST"]["res"] : T[P]["default"]["post"];
      };
      delete: {
        req: P extends keyof TypeofAppApi ? T[P]["DELETE"]["req"] : T[P]["default"]["$delete"];
        res: P extends keyof TypeofAppApi ? T[P]["DELETE"]["res"] : T[P]["default"]["delete"];
      };
    };
  };

  type _<A extends {
    [P in ApiPath]: {
      [M in Api.Methods]: Api.MethodInterface;
    };
  }> = A;

}

type ApiContext = Api.Import<TypeofApi> & Api._<{
  // custom api endpoints
}>;

type ApiPath = keyof ApiContext;
