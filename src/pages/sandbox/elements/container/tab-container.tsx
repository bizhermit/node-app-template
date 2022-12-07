import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import Row from "@/components/elements/row";
import TabContainer, { TabContent } from "@/components/elements/tab-container";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useState } from "react";
import { VscBrowser } from "react-icons/vsc";

const Page: NextPage = () => {
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);

  return (
    <div className="flex-box flex-start w-100 h-100 p-1 gap-1">
      <Row>
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
      </Row>
      <Divider />
      <TabContainer
        className="flex-1 w-100"
        $tabPosition={position}
        // $defaultMount
      >
        <TabContent
          key="tab1"
          label="Tab 1"
        >
          <h1>Tab 1</h1>
          {ArrayUtils.generateArray(10, (idx) => (
            <Row key={idx}>
              <h2>piyo {idx}</h2>
            </Row>
          ))}
        </TabContent>
        <TabContent
          key="tab2"
          label="Tab 2"
        >
          <h1>Tab 2</h1>
          {ArrayUtils.generateArray(10, (idx) => (
            <Row key={idx}>
              <h2>fuga {idx}</h2>
            </Row>
          ))}
        </TabContent>
        <TabContent
          key="tab3"
          label={<Row><VscBrowser /><span>Browser</span></Row>}
        >
          <h1>Tab 3</h1>
          {ArrayUtils.generateArray(10, (idx) => (
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