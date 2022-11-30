import Card from "@/components/elements/card";
import Divider from "@/components/elements/divider";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(true);

  return (
    <div className="flex-box flex-start p-1 w-100 h-100 gap-1">
      <Row className="gap-1">
        <ToggleBox
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleBox
          $tag="opened"
          $value={opened}
          $onChange={v => setOpened(v!)}
        />
      </Row>
      <Divider />
      <Card
        className="w-100"
        // $opened={opened}
        $accordion
        $disabled={disabled}
        $color="main"
        $iconPosition={{
          header: "end",
          footer: "start",
        }}
        $headerAlign="start"
        $footerAlign="end"
        $toggleTriger="h&f"
      >
        <></>
        <div className="flex-box flex-center p-3 w-100 c-pure">
          Content
        </div>
        Footer
      </Card>
      <Card
        className="flex-1"
        $color="main"
        $accordion
        $disabled={disabled}
        $direction="horizontal"
      >
        Header
        <div className="flex-box flex-center p-3 h-100 c-pure">
          Content
        </div>
        Footer
      </Card>
    </div>
  );
};

export default Page;