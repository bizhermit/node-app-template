"use client";

import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import CheckBox from "#/components/elements/form/items/check-box";
import NextLink from "#/components/elements/link";
import LinkButton from "#/components/elements/link-button";
import Row from "#/components/elements/row";

const LinkClient = () => {
  return (
    <div className="flex-start p-1 gap-2 w-100">
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
      <Form className="flex-center w-100">
        <Row className="gap-2 w-100">
          <CheckBox $required />
          <LinkButton href="https://bizhermit.com" $form className="flex-1">
            link button (form)
          </LinkButton>
          <LinkButton href="https://bizhermit.com" className="flex-1">
            link button (no form)
          </LinkButton>
        </Row>
      </Form>
    </div>
  );
};

export default LinkClient;