import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import TabContainer, { TabContent } from "@/components/elements/tab-container";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { Key, useState } from "react";
import { VscBrowser } from "react-icons/vsc";

const Page: NextPage = () => {
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [tabScroll, setTabScroll] = useState(true);
  const [key, setKey] = useState<Key>();

  return (
    <div className="flex-box flex-start w-100 h-100 p-1 gap-1">
      <Row $vAlign="bottom" className="gap-1">
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
          $tag="tab scroll"
          $value={tabScroll}
          $onChange={v => setTabScroll(v!)}
        />

        <Button $onClick={() => setKey("tab1")}>Tab 1</Button>
        <Button $onClick={() => setKey("tab2")}>Tab 2</Button>
        <Button $onClick={() => setKey("tab3")}>Tab 3</Button>
      </Row>
      <Divider />
      <TabContainer
        className={`w-100${tabScroll ? " flex-1_1_0" : ""}`}
        $tabPosition={position}
        // $bodyColor="pure"
        // $defaultMount
        // $unmountDeselected
        $key={key}
        $onChange={(key) => {
          setKey(key);
        }}
      >
        <TabContent
          key="tab1"
          label="Tab 1"
        >
          <div className="box h-100 px-1">
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
          <div className="box w-100 h-100 px-1">
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
          label={<Row><VscBrowser /><span>Tab3</span></Row>}
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

export default Page;