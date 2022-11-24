import { NextPage } from "next";
import Button from "@/components/elements/button";
import { VscCloudDownload } from "react-icons/vsc";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import { useState } from "react";
import Row from "@/components/templates/row";
import NextLink from "@/components/elements/link";

const Page: NextPage = () => {
  const [bind] = useState({});

  return (
    <div className="flex-box">
      <span>sandbox</span>
      <NextLink href="/">index</NextLink>
      <Form
        // $disabled
        $bind={bind}
        onSubmit={async () => {
          await new Promise<void>(resolve => {
            setTimeout(resolve, 2000);
          });
        }}
      >
        <Row className="gap-2" $hAlign="stretch">
          <TextBox
            name="text-box"
            $required
            $placeholder="TextBox"
            $messageDisplayMode="bottom"
          />
          <TextBox
            name="text-bot-length"
            $length={5}
            $placeholder="TextBox Tooltip"
            $messageDisplayMode="tooltip"
          />
          <Button
            type="submit"
            // $ignoreFormValidation
            // $round
            // $outline
            $icon={<VscCloudDownload />}
            $iconPosition="right"
            // $fillLabel
            style={{ width: 200 }}
          >
            BUTTON
          </Button>
          <Button
            $outline
          >
            BUTTON
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default Page;