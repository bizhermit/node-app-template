import Card from "#/components/elements/card";
import Divider from "#/components/elements/divider";
import ToggleBox from "#/components/elements/form-items/toggle-box";
import Row from "#/components/elements/row";
import type { NextPage } from "next";
import { type FC, useEffect, useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(true);
  const [accordion, setAccordion] = useState(true);

  return (
    <div className="flex-start p-1 w-100 h-100 gap-1">
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
        <ToggleBox
          $tag="accordion"
          $value={accordion}
          $onChange={v => setAccordion(v!)}
        />
      </Row>
      <Divider />
      <Card
        className="w-100 r-2 e-4"
        // $opened={opened}
        $defaultOpened={false}
        // $defaultMount
        $accordion={accordion}
        $disabled={disabled}
        // $color="primary"
        $iconPosition={{
          header: "end",
          footer: "start",
        }}
        $headerAlign="start"
        $footerAlign="end"
        $toggleTriger="h&f"
      >
        <span className="px-1 py-2">Header</span>
        <Content />
        Footer
      </Card>
      <Row className="flex-1 gap-2" $vAlign="stretch">
        <Card
          className="e-1 r-1"
          $color="main"
          // $opened={opened}
          $defaultOpened={false}
          // $defaultMount
          $accordion={accordion}
          $disabled={disabled}
          $direction="horizontal"
          // $footerAlign="center"
          $toggleTriger="h&f"
          $iconPosition={{
            footer: "end"
          }}
        >
          <span className="px-2">あいうえお</span>
          <Content />
          ん
        </Card>
        <Card
          $color="main"
          $resize
          // $resize="xy"
        >
          Resize
          <Content />
        </Card>
      </Row>
    </div>
  );
};

const Content: FC = () =>{
  
  useEffect(() => {
    console.log("mount");
    return () => {
      console.log("unmout");
    }
  }, []);

  return (
    <div className="flex-center p-3 h-100 w-100 c-pure">
      Content
    </div>
  )
};

export default Page;