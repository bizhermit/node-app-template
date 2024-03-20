import NextLink from "#/client/elements/link";

const Page = () => {
  return (
    <>
      dev extension page
      <NextLink
        href="/dev/extensions/hoge"
      >
        /dev/extensions/hoge
      </NextLink>
    </>
  );
};

export default Page;
