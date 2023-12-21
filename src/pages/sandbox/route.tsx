import NextLink from "#/client/elements/link";
import Text from "#/client/elements/text";
import SandboxLayoutProvider from "@/sandbox/_components/sandbox-layout";

const Page: NextPageWithLayout = () => {
  return (
    <div className="flex p-s">
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