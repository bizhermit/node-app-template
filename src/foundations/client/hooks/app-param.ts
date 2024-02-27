import { useParams, useSearchParams } from "next/navigation";

export const useUrlParam = <T extends string = string>(key: string) => {
  const val = useParams()?.[key];
  if (val == null || typeof val === "string") return val as T;
  return val[0] as T;
};

export const useQueryParam = <T extends string = string>(key: string) => {
  const val = useSearchParams()?.get(key);
  if (val == null || typeof val === "string") return val as T;
  return val[0] as T;
};

const useAppParam = <T extends string = string>(key: string) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const val = params?.[key] || searchParams?.get(key);
  if (val == null || typeof val === "string") return val as T;
  return val[0] as T;
};

export default useAppParam;
