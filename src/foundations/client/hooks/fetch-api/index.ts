import { useContext } from "react";
import { FetchApiContext } from "./context";

// const useFetch = <EndPoints extends ApiPath = ApiPath>() => {
//   return useContext(FetchApiContext) as FetchApiContextProps<EndPoints>;
// };

const useFetch = () => {
  return useContext(FetchApiContext);
};

export default useFetch;