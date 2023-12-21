import NextLink from "#/client/elements/link";

const Page = () => {
  return (
    <section>
      <h1>Node App Template</h1>
      <div>
        <NextLink href="/sandbox">
          SandBox
        </NextLink>
      </div>
      <div>
        <NextLink href="/dev">
          development
        </NextLink>
      </div>
    </section>
  );
};

export default Page;