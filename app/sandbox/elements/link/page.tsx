import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import CheckBox from "#/client/elements/form/items/check-box";
import NextLink from "#/client/elements/link";
import LinkButton from "#/client/elements/button/link";

const Page = () => {
  return (
    <div className="flex p-xs g-m w-100">
      <NextLink href="/sandbox/elements/link">next link</NextLink>
      <NextLink href="https://bizhermit.com">normal link</NextLink>
      <NextLink>no link</NextLink>
      <Divider />
      <LinkButton
        href="/"
      >
        link button
      </LinkButton>
      <LinkButton
        href="/"
        $disabled
      >
        link button (disabled)
      </LinkButton>
      <LinkButton>
        link button (no href)
      </LinkButton>
      <Form className="flex column center middle w-100">
        <div className="flex row g-m w-100">
          <CheckBox $required />
          <LinkButton href="https://bizhermit.com" $form className="flex-1">
            link button (form)
          </LinkButton>
          <LinkButton href="https://bizhermit.com" className="flex-1">
            link button (no form)
          </LinkButton>
        </div>
      </Form>
    </div>
  );
};

export default Page;