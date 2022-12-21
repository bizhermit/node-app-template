// type ParamsType = string | number | boolean | null | undefined;
// type Params = Struct<ParamsType | Array<ParamsType>>;

export type Api = Struct<{
  get?: any;
  post?: any;
  put?: any;
  delete?: any;
}>;

// type Props = {
//   baseUrl?: string;
// };

// type Options = {
//   silent?: boolean;
// };

// const useApi = <A extends Api>(props?: Props) => {

// };

// export default useApi;