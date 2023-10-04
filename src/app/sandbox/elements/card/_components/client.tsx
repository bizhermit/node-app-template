"use client";

import Card from "#/client/elements/card";
import Divider from "#/client/elements/divider";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { useEffect, useState, type FC } from "react";

const CardClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(true);
  const [accordion, setAccordion] = useState(true);

  return (
    <div className="flex p-xs w-100 h-100 g-s">
      <Row className="g-s">
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
        className="w-100 r-s e-4"
        // $opened={opened}
        $defaultClosed={false}
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
        Header
        {/* <span className="px-s py-m">
        </span> */}
        <Content />
        Footer
      </Card>
      <Row className="flex-1 g-m" $vAlign="stretch">
        <Card
          className="e-1 r-xs"
          $color="main"
          // $opened={opened}
          $defaultClosed={false}
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
          {/* <span className="px-m">あいうえお</span> */}
          あいうえお
          <Content />
          わをん
        </Card>
        <Card
          $color="main"
          $resize
        // $resize="xy"
        >
          Resize
          <Content />
        </Card>
        <Card
          className="e-3"
          $accordion
          $defaultClosed
          style={{ width: "40rem", alignSelf: "flex-start" }}
        >
          <>Card</>
          <div className="flex g-s p-m">
            Body
            Body
            <br />
            Body
          </div>
        </Card>
      </Row>
    </div>
  );
};

const Content: FC = () => {

  useEffect(() => {
    console.log("mount");
    return () => {
      console.log("unmout");
    }
  }, []);

  return (
    <div className="flex column center middle p-m h-100 w-100 c-pure">
      Content
    </div>
  )
};

export default CardClient;