import { useRouter as $useRouter, usePathname } from "next/navigation";
import { getDynamicUrl, type DynamicUrlOptions } from "../../objects/url/dynamic-url";

const useRouter = () => {
  const router = $useRouter();
  const pathname = usePathname();

  return {
    ...router,
    pathname: pathname as PagePath,
    push: (url: PagePath, params?: { [v: string | number | symbol]: any }, opts?: DynamicUrlOptions) => {
      router.push(getDynamicUrl(url, params, opts));
    },
    _push: router.push,
    replace: (url: PagePath, params?: { [v: string | number | symbol]: any }, opts?: DynamicUrlOptions) => {
      router.replace(getDynamicUrl(url, params, opts));
    },
    _replace: router.replace,
    replaceUrl: (url: PagePath, params?: { [v: string | number | symbol]: any }, opts?: DynamicUrlOptions & { stateData?: any; }) => {
      if (typeof window === "undefined") return;
      window.history.replaceState(opts?.stateData ?? window.history.state, "", getDynamicUrl(url, params, opts));
    },
  } as const;
};

export default useRouter;
