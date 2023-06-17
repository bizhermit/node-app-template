import NextLink from "#/components/elements/link";
import LinkButton from "#/components/elements/link-button";
import LinkClient from "@/sandbox/elements/link/client";

const Page = () => {
  return (
    <>
      <NextLink href="/sandbox/elements/link?id=1">client</NextLink>
      <LinkButton href="/sandbox/elements/link?id=2">client</LinkButton>
      <LinkClient />
    </>
  );
};

export default Page;