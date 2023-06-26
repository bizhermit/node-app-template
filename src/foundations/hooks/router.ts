import { type DynamicUrlContextOptions, getDynamicUrlContext } from "#/utilities/url";
import { useRouter as $useRouter, usePathname } from "next/navigation";

const useRouter = () => {
  const router = $useRouter();
  const pathname = usePathname();

  return {
    ...router,
    pathname: pathname as PagePath,
    push: (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
      router.push(getDynamicUrlContext(url, params, options).url);
    },
    _push: router.push,
    replace: (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
      router.replace(getDynamicUrlContext(url, params, options).url);
    },
    _replace: router.replace,
    replaceUrl: (url: PagePath, params?: Struct, options?: DynamicUrlContextOptions) => {
      if (typeof window === "undefined") return;
      window.history.replaceState(undefined, "", getDynamicUrlContext(url, params, options).url);
    },
  } as const;
};

export default useRouter;