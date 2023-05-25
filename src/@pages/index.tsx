import type { NextPage } from "next";
import NextLink from "#/components/elements/link";

const Page: NextPage = () => {
  return (
    <section>
      <h1>Node App Template</h1>
      <NextLink href="/sandbox">
        SandBox
      </NextLink>
    </section>
  );
};

export default Page;