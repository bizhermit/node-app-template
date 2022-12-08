import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import SlideContainer, { SlideContent, SlideDirection } from "@/components/elements/slide-container";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { Key, useState } from "react";
import { VscBrowser } from "react-icons/vsc";

const Page: NextPage = () => {
  const [destination, setDestination] = useState<SlideDirection>(null!);
  const [scroll, setScroll] = useState(true);
  const [index, setIndex] = useState(0);
  const [overlap, setOverlap] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(false);

  return (
    <div className="flex-box flex-start w-100 h-100 p-1 gap-1">
      <Row $vAlign="bottom" className="gap-1">
        <RadioButtons
          $tag="slide destination"
          $source={[
            { value: "horizontal", label: "horizontal" },
            { value: "horizontal-reverse", label: "horizontal-reverse" },
            { value: "vertical", label: "vertical" },
            { value: "vertical-reverse", label: "vertical-reverse" },
          ]}
          $value={destination}
          $onChange={v => setDestination(v!)}
        />
        <ToggleBox
          $tag="overlap"
          $value={overlap}
          $onChange={(v) => setOverlap(v!)}
        />
        <ToggleBox
          $tag="breadcrumbs"
          $value={breadcrumbs}
          $onChange={v => setBreadcrumbs(v!)}
        />
        <ToggleBox
          $tag="scroll"
          $value={scroll}
          $onChange={v => setScroll(v!)}
        />
        <Button $onClick={() => setIndex(0)}>0</Button>
        <Button $onClick={() => setIndex(1)}>1</Button>
        <Button $onClick={() => setIndex(2)}>2</Button>
      </Row>
      <Divider />
      <SlideContainer
        className={`w-100${scroll ? " flex-1_1_0" : ""}`}
        $direction={destination}
        $index={index}
        $overlap={overlap}
        $breadcrumbs={breadcrumbs}
        // $bodyColor="pure"
        // $defaultMount
        // $unmountDeselected
      >
        <SlideContent label="Tab 1">
          <div className="box h-min100 px-1 c-primary">
            <h1>Tab 1</h1>
            {ArrayUtils.generateArray(10, (idx) => (
              <Row key={idx}>
                <h2>piyo {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label="Tab 2">
          <div className="box w-100 h-min100 px-1 c-secondary">
            <h1>Tab 2</h1>
            {ArrayUtils.generateArray(15, (idx) => (
              <Row key={idx}>
                <h2>fuga {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label={<Row><VscBrowser /><span>Tab3</span></Row>}>
          {/* <div className="box w-100 h-min100 c-tertiary p-1"> */}
            <h1>Tab 3</h1>
            {ArrayUtils.generateArray(20, (idx) => (
              <Row key={idx}>
                <h2>hoge {idx}</h2>
              </Row>
            ))}
          {/* </div> */}
        </SlideContent>
      </SlideContainer>
    </div>
  );
};

export default Page;