import useFetch from "#/hooks/fetch-api";
import { type DependencyList, useCallback } from "react";

const cache: { [key: string]: Array<any> } = {};

const useSource = <T extends { [key: string]: any }, K extends ApiPath>(
  apiPath: K,
  params: ApiRequest<K, "get">, options?: {
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
      const ret = (res.data as { [key: string]: any })[options?.name || "value"] as Array<T>;
      if (!options?.noCache) cache[key] = ret;
      return [...ret];
    } catch {
      return [] as Array<T>;
    }
  }, deps ?? []);
};

export default useSource;