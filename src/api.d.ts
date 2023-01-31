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

type Test04<T> = T extends { [_ in keyof T]: infer R } ? R : never;
type Test05<T> = (T extends any ? (_: T) => void : never) extends (_: infer R) => void ? R : never;

type RequestValue = DataItem | { [key: string]: RequestValue };
type ValueType<T extends RequestValue> =
  T extends { name: string; type: string } ? (
    T["type"] extends DataItem_String["type"] ? string :
    T["type"] extends DataItem_Number["type"] ? number :
    T["type"] extends DataItem_Boolean["type"] ? boolean :
    T["type"] extends DataItem_Date["type"] ? Date :
    T["type"] extends DataItem_Array["type"] ? Array<any> :
    any
  ) : { [P in keyof T]: ValueType<T[P]> };

type $ApiReq<S extends { [key: string]: DataItem }> = {
  [P in keyof S]: ValueType<S[P]>;
};
type $Api<T> = {
  get: {
    req: T["GetReq"];
    res: T["GetRes"];
  };
  put: {
    req: T["PutReq"];
    res: T["PutRes"];
  };
  post: {
    req: $ApiReq<T["PostReq"]>;
    res: T["PostRes"];
  };
  delete: {
    req: T["DeleteReq"];
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