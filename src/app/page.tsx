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
      <div>
        <NextLink href="/sign-in">
          sign-in
        </NextLink>
      </div>
      <div>
        <NextLink href="/[uid]" params={{ uid: 1 }} query={{ hoge: 1 }}>
          signed-in page
        </NextLink>
      </div>
    </section>
  );
};

export default Page;