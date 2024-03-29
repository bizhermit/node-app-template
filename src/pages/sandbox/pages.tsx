import Button from "#/client/elements/button";
import NextLink from "#/client/elements/link";
import Text from "#/client/elements/text";
import useRouter from "#/client/hooks/router";
import SandboxLayoutProvider from "../../app/sandbox/_components/sandbox-layout";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  return (
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
      <NextLink
        href="/sandbox/nest/[id]"
        params={{ id: 10 }}
      >
        sandbox/nest/[id]
      </NextLink>
      <NextLink href="/pages">
        pages
      </NextLink>
      <NextLink href="/root">
        root
      </NextLink>
      <Button
        onClick={() => {
          router.push("/dev/dynamic-route");
        }}
      >
        /dev/dynamic-route
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