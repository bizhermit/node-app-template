import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-2">
      <Text>
        pages directory.
      </Text>
      <NextLink href="/sandbox">
        sandbox
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

export default Page;