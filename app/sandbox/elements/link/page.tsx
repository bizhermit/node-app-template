import LinkButton from "#/client/elements/button/link";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import CheckBox from "#/client/elements/form/items/check-box";
import NextLink from "#/client/elements/link";

const Page = () => {
  return (
    <div className="flex p-xs g-m w-100">
      <NextLink href="/sandbox/elements/link">next link</NextLink>
      <NextLink href="https://bizhermit.com">normal link</NextLink>
      <NextLink>no link</NextLink>
      <Divider />
      <NextLink
        href="/sandbox/dynamic/[id]"
        params={{ id: 1 }}
      // disabled
      >
        slug
      </NextLink>
      <NextLink
        href="/sandbox/dynamic/slug/[...slug]"
        // params={{ slug: 2 }}
        query={{ hoge: 1 }}
      // disabled
      >
        slug
      </NextLink>
      <NextLink
        href="/sandbox/dynamic/slug-arr/[[...slug]]"
        params={{ slug: [3, 4] }}
        query={{ hoge: 2 }}
      >
        slug array
      </NextLink>
      <NextLink
        // disabled
        href="http://bizhermit.com"
      >
        bizhermit.com
      </NextLink>
      <LinkButton
        href="/"
      >
        link button
      </LinkButton>
      <LinkButton
        href="/"
        disabled
      >
        link button (disabled)
      </LinkButton>
      <LinkButton>
        link button (no href)
      </LinkButton>
      <Form className="flex column center middle w-100">
        <div className="flex row g-m w-100">
          <CheckBox $required />
          <LinkButton
            className="flex-1"
            href="https://bizhermit.com"
            $dependsOnForm="submit"
          >
            link button (form)
          </LinkButton>
          <LinkButton
            className="flex-1"
            href="https://bizhermit.com"
            $color="sub"
            target="_blank"
          >
            link button (no form)
          </LinkButton>
        </div>
      </Form>
    </div>
  );
};

export default Page;