import { getDynamicUrlContext } from "@/utilities/url";
import { useRouter as $useRouter } from "next/navigation";

const useRouter = () => {
  const router = $useRouter();
  return {
    ...router,
    push: (url: PagePath, params?: Struct) => {
      router.push(getDynamicUrlContext(url, params).url);
    },
  } as const;
};

export default useRouter;