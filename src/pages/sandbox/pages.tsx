import Button from "#/components/elements/button";
import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import useRouter from "#/hooks/router";
import SandboxLayoutProvider from "@/sandbox/_components/sandbox-layout";
import type { NextPageWithLayout } from "~/_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <div className="flex-start p-s">
      <Text>
        pages directory.
      </Text>
      <NextLink href="/sandbox">
        sandbox
      </NextLink>
      <NextLink href="/sandbox/route">
        sandbox/route
      </NextLink>
      <NextLink href="/sandbox/nest/10">
        sandbox/nest/[id]
      </NextLink>
      <NextLink href="/pages">
        pages
      </NextLink>
      <NextLink href="/root">
        root
      </NextLink>
      <Button
        $onClick={() => {
          router.push("/sandbox/dynamic");
        }}
      >
        /sandbox/dynamic
      </Button>
    </div>
  );
};

Page.layout = (page) => {
  return (
    <SandboxLayoutProvider>
      {page}
    </SandboxLayoutProvider>
  );
};

export default Page;