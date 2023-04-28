import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import SlideContainer, { SlideContent, type SlideDirection } from "@/components/elements/slide-container";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import type { NextPage } from "next";
import { useState } from "react";
import { VscBrowser } from "react-icons/vsc";

const Page: NextPage = () => {
  const [direction, setDirection] = useState<SlideDirection>(null!);
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [scroll, setScroll] = useState(true);
  const [index, setIndex] = useState(0);
  const [overlap, setOverlap] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState(false);

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <Row $vAlign="bottom" className="gap-1">
        <RadioButtons
          $tag="slide destination"
          $source={[
            { value: "horizontal", label: "horizontal" },
            { value: "horizontal-reverse", label: "horizontal-reverse" },
            { value: "vertical", label: "vertical" },
            { value: "vertical-reverse", label: "vertical-reverse" },
          ]}
          $value={direction}
          $onChange={v => setDirection(v!)}
        />
        <ToggleBox
          $tag="breadcrumbs"
          $value={breadcrumbs}
          $onChange={v => setBreadcrumbs(v!)}
        />
        <RadioButtons
          $tag="breadcrumbs position"
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
          $tag="scroll"
          $value={scroll}
          $onChange={v => setScroll(v!)}
        />
        <ToggleBox
          $tag="animation"
          $value={animation}
          $onChange={v => setAnimation(v!)}
        />
        {ArrayUtils.generateArray(10, idx => {
          return (
            <Button key={idx} $onClick={() => setIndex(idx)}>{idx}</Button>
          )
        })}
      </Row>
      <Divider />
      <SlideContainer
        className={`w-100${scroll ? " flex-1_1_0" : ""}`}
        onWheel={(e) => {
          switch (direction) {
            case "vertical":
              if (e.deltaY > 0) {
                setIndex(c => Math.min(c + 1, 9));
              } else if (e.deltaY < 0) {
                setIndex(c => Math.max(c - 1, 0));
              }
              break;
            case "vertical-reverse":
              if (e.deltaY > 0) {
                setIndex(c => Math.max(c - 1, 0));
              } else if (e.deltaY < 0) {
                setIndex(c => Math.min(c + 1, 9));
              }
              break;
            case "horizontal-reverse":
              if (e.deltaX > 0) {
                setIndex(c => Math.max(c - 1, 0));
              } else if (e.deltaX < 0) {
                setIndex(c => Math.min(c + 1, 9));
              }
              break;
            default:
              if (e.deltaX > 0) {
                setIndex(c => Math.min(c + 1, 9));
              } else if (e.deltaX < 0) {
                setIndex(c => Math.max(c - 1, 0));
              }
              break;
          }
        }}
        $direction={direction}
        $index={index}
        $overlap={overlap}
        $breadcrumbs={breadcrumbs}
        $breadcrumbsPosition={position}
        $preventAnimation={!animation}
      // $bodyColor="pure"
      // $defaultMount
      // $unmountDeselected
      >
        <SlideContent label="Slide 0">
          <div className="box h-min100 px-1 c-primary">
            <h1>Slide 0</h1>
            {ArrayUtils.generateArray(10, (idx) => (
              <Row key={idx}>
                <h2>piyo {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label="Slide 1">
          <div className="box w-100 h-min100 px-1 c-secondary">
            <h1>Slide 1</h1>
            {ArrayUtils.generateArray(15, (idx) => (
              <Row key={idx}>
                <h2>fuga {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label={<Row $nowrap><VscBrowser /><span>Slide2</span></Row>}>
          {/* <div className="box w-100 h-min100 c-tertiary p-1"> */}
          <h1>Slide 2</h1>
          {ArrayUtils.generateArray(20, (idx) => (
            <Row key={idx}>
              <h2>hoge {idx}</h2>
            </Row>
          ))}
          {/* </div> */}
        </SlideContent>
        <SlideContent label="Slide 3">
          <h1>Slide 3</h1>
        </SlideContent>
        <SlideContent label="Slide 4">
          <h1>Slide 4</h1>
        </SlideContent>
        <SlideContent label="Slide 5">
          <h1>Slide 5</h1>
        </SlideContent>
        <SlideContent label="Slide 6">
          <h1>Slide 6</h1>
        </SlideContent>
        <SlideContent label="Slide 7">
          <h1>Slide 7</h1>
        </SlideContent>
        <SlideContent label="Slide 8">
          <h1>Slide 8</h1>
        </SlideContent>
        <SlideContent label="Slide 9">
          <h1>Slide 9</h1>
        </SlideContent>
      </SlideContainer>
    </div>
  );
};

export default Page;