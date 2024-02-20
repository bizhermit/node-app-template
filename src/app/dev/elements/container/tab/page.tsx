/* eslint-disable no-alert */
"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { FormIcon, HomeIcon, MagnifyingGlassIcon } from "#/client/elements/icon";
import TabContainer, { TabContent, TabLabel } from "#/client/elements/tab-container";
import Text from "#/client/elements/text";
import generateArray from "#/objects/array/generator";
import { useState } from "react";
import BaseLayout, { BaseRow } from "../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../_components/control-layout";

type TabKey = "tab1" | "tab2" | "tab3" | "4";
type TabTextMode = "text" | "icon" | "texticon";

const Page = () => {
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [tabFill, setTabFill] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [key, setKey] = useState<TabKey>();
  const [unmountDeselected, setUnmountDeselected] = useState(false);
  const [tabTextMode, setTabTextMode] = useState<TabTextMode>();

  return (
    <BaseLayout
      title="Tab Container"
      scroll={scroll}
    >
      <ControlLayout>
        <ControlItem caption="position">
          <RadioButtons
            $unselectable
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
        <ControlItem caption="scroll">
          <ToggleBox
            $value={scroll}
            $onChange={v => setScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="tab fill">
          <ToggleBox
            $value={tabFill}
            $onChange={v => setTabFill(v!)}
          />
        </ControlItem>
        <ControlItem caption="unmount">
          <ToggleBox
            $value={unmountDeselected}
            $onChange={v => setUnmountDeselected(v!)}
          />
        </ControlItem>
        <ControlItem caption="switch">
          <BaseRow>
            <Button $fitContent onClick={() => setKey("tab1")}>Tab 1</Button>
            <Button $fitContent onClick={() => setKey("tab2")}>Tab 2</Button>
            <Button $fitContent onClick={() => setKey("tab3")}>Tab 3</Button>
          </BaseRow>
        </ControlItem>
        <ControlItem caption="tab text">
          <RadioButtons<TabTextMode>
            $value={tabTextMode}
            $onChange={v => setTabTextMode(v!)}
            $source={[
              "text",
              "icon",
              "icontext",
            ].map(s => ({ value: s, label: s }))}
          />
        </ControlItem>
      </ControlLayout>
      <TabContainer<TabKey>
        // ref={ref}
        style={{
          width: "100%",
          flex: scroll ? "1 1 0rem" : undefined,
        }}
        $tabPosition={position}
        // $defaultMount
        $color="primary"
        $key={key}
        $onChange={(key) => {
          // console.log(key, ref.current);
          setKey(key);
        }}
        $tabFill={tabFill}
        $unmountDeselected={unmountDeselected}
      >
        <TabContent
          key="tab1"
          $label={
            tabTextMode === "text" ? <TabLabel>HOME</TabLabel> :
              tabTextMode === "icon" ? <HomeIcon /> :
                <TabLabel><HomeIcon /><Text>HOME</Text></TabLabel>
          }
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
          $label={<FormIcon />}
          $color="main"
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
          $label={<MagnifyingGlassIcon />}
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
