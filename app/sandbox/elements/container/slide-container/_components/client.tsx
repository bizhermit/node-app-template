"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { CloudIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import SlideContainer, { type SlideDirection } from "#/client/elements/slide-container";
import SlideContent from "#/client/elements/slide-container/content";
import generateArray from "#/objects/array/generator";
import { useState } from "react";

const SlideContainerClient = () => {
  const [direction, setDirection] = useState<SlideDirection>(null!);
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [scroll, setScroll] = useState(true);
  const [index, setIndex] = useState(0);
  const [overlap, setOverlap] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState(false);

  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <Row $vAlign="bottom" className="g-s">
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
        {generateArray(10, idx => {
          return (
            <Button key={idx} onClick={() => setIndex(idx)}>{idx}</Button>
          )
        })}
      </Row>
      <Divider />
      <SlideContainer
        className={`w-100${scroll ? " flex-11" : ""}`}
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
          <div className="box h-min100 px-s c-primary">
            <h1>Slide 0</h1>
            {generateArray(10, (idx) => (
              <Row key={idx}>
                <h2>piyo {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label="Slide 1">
          <div className="box w-100 h-min100 px-s c-secondary">
            <h1>Slide 1</h1>
            {generateArray(15, (idx) => (
              <Row key={idx}>
                <h2>fuga {idx}</h2>
              </Row>
            ))}
          </div>
        </SlideContent>
        <SlideContent label={<><CloudIcon /><span>Slide2</span></>}>
          {/* <div className="box w-100 h-min100 c-tertiary p-xs"> */}
          <h1>Slide 2</h1>
          {generateArray(20, (idx) => (
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

export default SlideContainerClient;