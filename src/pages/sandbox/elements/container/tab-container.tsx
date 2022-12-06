import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import Row from "@/components/elements/row";
import TabContainer, { TabContent } from "@/components/elements/tab-container";
import { NextPage } from "next";
import { useState } from "react";

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
      >
        <TabContent
          key="tab1"
          label="Tab 1"
        >
          <h1>Tab 1</h1>
        </TabContent>
        <TabContent
          key="tab2"
          label="Tab 2"
        >
          <h1>Tab 2</h1>
        </TabContent>
      </TabContainer>
    </div>
  );
};

export default Page;