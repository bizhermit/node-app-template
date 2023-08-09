import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-s">
      <Text>
        pages directory.
      </Text>
      <NextLink href="/">
        index
      </NextLink>
      <NextLink href="/root">
        root
      </NextLink>
      <NextLink href="/sandbox">
        sandbox
      </NextLink>
      <NextLink href="/sandbox/pages">
        sandbox/pages
      </NextLink>
    </div>
  );
};

export default Page;