import useFetch from "@/hooks/fetch-api";
import { type DependencyList, useCallback } from "react";

const cache: Struct = {};

const useSource = <T extends Struct, K extends ApiPath>(
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
      if (!options?.noCache && key in cache) return cache[key];
      const res = await api.get(apiPath, params);
      const ret = (res.data as T)[options?.name || "value"];
      if (!options?.noCache) cache[key] = ret;
      return ret;
    } catch {
      // ignore
    }
  }, deps ?? []);
};

export default useSource;