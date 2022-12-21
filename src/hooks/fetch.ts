// type ParamsType = string | number | boolean | null | undefined;
// type Params = Struct<ParamsType | Array<ParamsType>>;

type MethodArgs = {
  request?: Struct | FormData;
  response?: Struct;
};

export type ApiPaths = {
  [key: string]: {
    get?: MethodArgs;
    post?: MethodArgs;
    put?: MethodArgs;
    delete?: MethodArgs;
  };
};

// type Props = {
//   baseUrl?: string;
// };

// type Options = {
//   silent?: boolean;
// };

// const useApi = <A extends Api>(props?: Props) => {

// };

// export default useApi;