import NextLink from "#/client/elements/link";
import Text from "#/client/elements/text";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex p-s">
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
