import NextLink from "#/components/elements/link";
import Text from "#/components/elements/text";
import { getInitialQueryProps, useQueryParam } from "#/hooks/query-param";
import { NextPageWithLayout } from "~/_app";

const Page: NextPageWithLayout = (props) => {
  const [id] = useQueryParam(props, "id");
  return (
    <div className="p-s">
      <Text>
        {id}
      </Text>
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
      <NextLink href="/pages">
        pages
      </NextLink>
      <NextLink href="/root">
        root
      </NextLink>
    </div>
    </div>
  );
};

Page.getInitialProps = getInitialQueryProps("id");

export default Page;