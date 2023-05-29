import { DynamicUrlContextOptions, getDynamicUrlContext } from "#/utilities/url";
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
  } as const;
};

export default useRouter;