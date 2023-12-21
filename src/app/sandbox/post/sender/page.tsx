"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import NumberBox from "#/client/elements/form/items/number-box";
import TextBox from "#/client/elements/form/items/text-box";
import PasswordBox from "#/client/elements/form/items/text-box/password";

const Page = () => {
  return (
    <div className="flex p-m g-m">
      <h1>sender</h1>
      <Form
        className="flex g-m"
        method="post"
        action="/sandbox/post/recipient"
      >
        <TextBox
          name="param1"
        />
        <PasswordBox
          name="param2"
        />
        <NumberBox
          name="param3"
        />
        <Button type="submit">
          post
        </Button>
      </Form>
    </div>
  );
};

export default Page;