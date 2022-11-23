import { NextPage } from "next";
import Link from "next/link";
import Button from "@/components/elements/button";
import { VscCloudDownload } from "react-icons/vsc";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import { useRef, useState } from "react";
import Row from "@/components/templates/row";

const Page: NextPage = () => {
  const [bind, setBind] = useState({});

  return (
    <div className="flex-box">
      <span>sandbox</span>
      <Link href="/">index</Link>
      <Form
        // $disabled
        $bind={bind}
        onSubmit={async () => {
          await new Promise<void>(resolve => {
            setTimeout(resolve, 2000);
          })
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
            $ignoreFormValidation
            // $round
            $outline
            $icon={<VscCloudDownload />}
            $iconPosition="right"
            // $fillLabel
            style={{ width: 200 }}
          >
            BUTTON
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default Page;