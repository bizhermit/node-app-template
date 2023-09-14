import NextLink from "#/client/elements/link";
import Text from "#/client/elements/text";
import { getInitialQueryProps, useQueryParam } from "#/client/hooks/query-param";
import { NextPageWithLayout } from "~/_app";

const Page: NextPageWithLayout = (props) => {
  const [id] = useQueryParam(props, "id");
  return (
    <div className="p-s">
      <Text>
        {id}
      </Text>
      <div className="flex p-s">
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