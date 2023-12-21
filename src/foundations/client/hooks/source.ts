import { useCallback, type DependencyList } from "react";
import useFetch from "./fetch-api";

const cache: { [v: string]: Array<any> } = {};

const useSource = <T extends { [key: string]: any }, K extends ApiPath>(
  apiPath: K,
  params: Api.Request<K, "get">,
  options?: {
    name?: string;
    noCache?: boolean;
  }
  , deps?: DependencyList
) => {
  const api = useFetch();

  return useCallback(async () => {
    try {
      const key = apiPath + JSON.stringify(params ?? {});
      if (!options?.noCache && key in cache) return [...cache[key]] as Array<T>;
      const res = await api.get(apiPath, params);
      const ret = (res.data as { [v: string]: any })[options?.name || "value"] as Array<T>;
      if (!options?.noCache) cache[key] = ret;
      return [...ret];
    } catch {
      return [] as Array<T>;
    }
  }, deps ?? []);
};

export default useSource;