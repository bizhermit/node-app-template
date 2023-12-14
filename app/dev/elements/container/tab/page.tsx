/* eslint-disable no-alert */
"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { PlusIcon } from "#/client/elements/icon";
import TabContainer from "#/client/elements/tab-container";
import TabContent from "#/client/elements/tab-container/content";
import Text from "#/client/elements/text";
import generateArray from "#/objects/array/generator";
import BaseLayout, { BaseRow } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

type TabKey = "tab1" | "tab2" | "tab3" | 4;

const Page = () => {
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [tabScroll, setTabScroll] = useState(false);
  const [key, setKey] = useState<TabKey>();
  const [overlap, setOverlap] = useState(false);

  return (
    <BaseLayout
      title="Tab Container"
      scroll={tabScroll}
    >
      <ControlLayout>
        <ControlItem caption="position">
          <RadioButtons
            $source={[
              { value: "top", label: "top" },
              { value: "left", label: "left" },
              { value: "right", label: "right" },
              { value: "bottom", label: "bottom" },
            ]}
            $value={position}
            $onChange={v => setPosition(v!)}
          />
        </ControlItem>
        <ControlItem caption="overlap">
          <ToggleBox
            $value={overlap}
            $onChange={(v) => setOverlap(v!)}
          />
        </ControlItem>
        <ControlItem caption="scroll">
          <ToggleBox
            $value={tabScroll}
            $onChange={v => setTabScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="switch">
          <BaseRow>
            <Button $fitContent onClick={() => setKey("tab1")}>Tab 1</Button>
            <Button $fitContent onClick={() => setKey("tab2")}>Tab 2</Button>
            <Button $fitContent onClick={() => setKey("tab3")}>Tab 3</Button>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <TabContainer<TabKey>
        // ref={ref}
        style={{
          width: "100%",
          flex: tabScroll ? "1 1 0rem" : undefined,
        }}
        $tabPosition={position}
        $overlap={overlap}
        // $bodyColor="pure"
        // $defaultMount
        // $unmountDeselected
        $color="primary"
        $key={key}
        $onChange={(key) => {
          // console.log(key, ref.current);
          setKey(key);
        }}
      >
        <TabContent
          key="tab1"
          $label="Tab 1"
          className="bgc-pure"
        >
          <div>
            <h2>Tab 1</h2>
            <Button
              $outline
              onClick={() => {
                alert("tab1");
              }}
            />
            {generateArray(10, (idx) => (
              <h3 key={idx}>piyo {idx}</h3>
            ))}
          </div>
        </TabContent>
        <TabContent
          key="tab2"
          $label="Tab 2"
          $color="sub"
        >
          <div>
            <h2>Tab 2</h2>
            <Button
              $outline
              onClick={() => {
                alert("tab2");
              }}
            />
            {generateArray(15, (idx) => (
              <h3 key={idx}>fuga {idx}</h3>
            ))}
          </div>
        </TabContent>
        <TabContent
          key="tab3"
          $label={<><PlusIcon /><Text>Tab3</Text></>}
        >
          <h2>Tab 3</h2>
          <Button
            $outline
            onClick={() => {
              alert("tab3");
            }}
          />
          {generateArray(20, (idx) => (
            <h3 key={idx}>hoge {idx}</h3>
          ))}
        </TabContent>
      </TabContainer>
    </BaseLayout>
  );
};

export default Page;