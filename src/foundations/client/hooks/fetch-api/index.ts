import { useContext } from "react";
import { FetchApiContext, type FetchApiContextProps } from "./context";

const useFetch = <EndPoints extends ApiPath = ApiPath>() => {
  return useContext(FetchApiContext) as FetchApiContextProps<EndPoints>;
};

export default useFetch;