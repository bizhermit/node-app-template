import Button from "@/components/elements/button";
import NextLink from "@/components/elements/link";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <div className="flex-start p-1 gap-1">
      <NextLink href="/sandbox/elements/link">next link</NextLink>
      <NextLink href="https://bizhermit.com" >normal link</NextLink>
      <NextLink>no link</NextLink>
      <NextLink href="/sandbox/elements/link">
        <Button>next link</Button>
      </NextLink>
      <NextLink href="https://bizhermit.com" >
        <Button>normal link</Button>
      </NextLink>
      <NextLink>
        <Button>no link</Button>
      </NextLink>
    </div>
  );
};

export default Page;