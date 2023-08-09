import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import SandboxLayoutProvider from "@/sandbox/_components/sandbox-layout";
import type { NextPageWithLayout } from "~/_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="flex-start p-s">
      <Text>
        pages directory.
      </Text>
      <NextLink href="/sandbox">
        sandbox
      </NextLink>
      <NextLink href="/sandbox/pages">
        sandbox/pages
      </NextLink>
      <NextLink href="/pages">
        pages
      </NextLink>
      <NextLink href="/root">
        root
      </NextLink>
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