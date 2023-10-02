"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { CloudIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import TabContainer from "#/client/elements/tab-container";
import TabContent from "#/client/elements/tab-container/content";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { type Key, useState, useRef } from "react";

type TabKey = "tab1" | "tab2" | "tab3" | 4;

const TabContainerClient = () => {
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [tabScroll, setTabScroll] = useState(true);
  const [key, setKey] = useState<TabKey>();
  const [overlap, setOverlap] = useState(false);
  const ref = useRef<HTMLDivElement>();

  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <Row $vAlign="bottom" className="g-s">
        <RadioButtons
          $tag="tab position"
          $source={[
            { value: "top", label: "top" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
            { value: "bottom", label: "bottom" },
          ]}
          $value={position}
          $onChange={v => setPosition(v!)}
        />
        <ToggleBox
          $tag="overlap"
          $value={overlap}
          $onChange={(v) => setOverlap(v!)}
        />
        <ToggleBox
          $tag="tab scroll"
          $value={tabScroll}
          $onChange={v => setTabScroll(v!)}
        />
        <Button $onClick={() => setKey("tab1")}>Tab 1</Button>
        <Button $onClick={() => setKey("tab2")}>Tab 2</Button>
        <Button $onClick={() => setKey("tab3")}>Tab 3</Button>
      </Row>
      <Divider />
      <TabContainer<TabKey>
        ref={ref}
        className={`w-100${tabScroll ? " flex-11" : ""}`}
        $tabPosition={position}
        $overlap={overlap}
        // $bodyColor="pure"
        // $defaultMount
        // $unmountDeselected
        $key={key}
        $onChange={(key) => {
          console.log(key, ref.current);
          setKey(key);
        }}
      >
        <TabContent
          key="tab1"
          label="Tab 1"
        >
          <div className="box h-100 px-s">
            <h1>Tab 1</h1>
            <Button
              $outline
              $onClick={() => {
                alert("tab1");
              }}
            />
            {ArrayUtils.generateArray(10, (idx) => (
              <Row key={idx}>
                <h2>piyo {idx}</h2>
              </Row>
            ))}
          </div>
        </TabContent>
        <TabContent
          key="tab2"
          label="Tab 2"
        >
          <div className="box w-100 h-100 px-s">
            <h1>Tab 2</h1>
            <Button
              $outline
              $onClick={() => {
                alert("tab2");
              }}
            />
            {ArrayUtils.generateArray(15, (idx) => (
              <Row key={idx}>
                <h2>fuga {idx}</h2>
              </Row>
            ))}
          </div>
        </TabContent>
        <TabContent
          key="tab3"
          label={<><CloudIcon /><span>Tab3</span></>}
        >
          <h1>Tab 3</h1>
          <Button
            $outline
            $onClick={() => {
              alert("tab3");
            }}
          />
          {ArrayUtils.generateArray(20, (idx) => (
            <Row key={idx}>
              <h2>hoge {idx}</h2>
            </Row>
          ))}
        </TabContent>
      </TabContainer>
    </div>
  );
};

export default TabContainerClient;