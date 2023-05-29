import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import SandboxPageProvider from "$/components/provider/sandbox";
import type { NextPageWithLayout } from "~/_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="flex-start p-2">
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

Page.getLayout = (page) => {
  return (
    <SandboxPageProvider>
      {page}
    </SandboxPageProvider>
  );
};

export default Page;