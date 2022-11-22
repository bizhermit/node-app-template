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
          />
          <TextBox
            name="text-bot-length"
            $length={5}
          />
          <Button
            type="submit"
            // $round
            $outline
            $icon={<VscCloudDownload />}
            $iconPosition="left"
          >
            BUTTON
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default Page;