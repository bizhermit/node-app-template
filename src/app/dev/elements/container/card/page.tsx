/* eslint-disable no-console */
"use client";

import Card from "#/client/elements/card";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { useState } from "react";
import BaseLayout, { BaseRow, BaseSheet } from "../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../_components/control-layout";

const Page = () => {
  const [accordion, setAccordion] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <BaseLayout title="Card">
      <ControlLayout>
        <ControlItem caption="accordion">
          <ToggleBox
            $value={accordion}
            $onChange={v => setAccordion(v!)}
          />
        </ControlItem>
        <ControlItem caption="disabled">
          <ToggleBox
            $value={disabled}
            $onChange={v => setDisabled(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <BaseRow>
          <Card
            style={{ width: 300 }}
            $header="header"
            $footer="footer"
            $accordion={accordion}
            $color="primary"
            $defaultClosed
            $unmountClosed
            $disabled={disabled}
            $onToggled={open => console.log("card accrodion:", open)}
            $headerIconPosition="end"
          >
            <div style={{ padding: "var(--b-m)" }}>
              contents
            </div>
          </Card>
          <Card
            style={{ height: 300 }}
            $header="header"
            $footer="footer"
            $direction="horizontal"
            $accordion={accordion}
            $disabled={disabled}
          >
            <div style={{ padding: "var(--b-m)" }}>
              contents
            </div>
          </Card>
          <Card
            $header="resizable card"
            $footer="resizable card"
            $resize
            $accordion={accordion}
            $disabled={disabled}
          >
            <div style={{ padding: "var(--b-m)" }}>
              <div style={{ position: "sticky", top: 0 }}>
                resiezable x-y
              </div>
              <div
                style={{
                  height: 200,
                  // height: "10rem",
                  // height: "100%",
                  // width: "150vw",
                  // width: "10rem",
                  // width: "100%",
                  background: "linear-gradient(-225deg, var(--c-main) 0%, var(--c-sub) 100%)",
                  display: "flex",
                  flexFlow: "column nowrap",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  // justifyContent: "flex-end",
                  // alignItems: "flex-end",
                  borderRadius: 10,
                  wordBreak: "break-all",
                  padding: 20,
                }}
              >
                bodybodybodybodybodybodybodybodybody
                {/* bodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybody */}
              </div>
            </div>
          </Card>
        </BaseRow>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
