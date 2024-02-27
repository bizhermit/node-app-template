"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import SlideContainer, { SlideContent } from "#/client/elements/slide-container";
import generateArray from "#/objects/array/generator";
import { useState } from "react";
import BaseLayout, { BaseRow } from "../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../_components/control-layout";

const Page = () => {
  const [key, setKey] = useState<string>();
  const [overlap, setOverlap] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(false);
  const [position, setPosition] = useState<"top" | "left" | "right" | "bottom">(null!);
  const [direction, setDirection] = useState<"horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse">(null!);
  const [scroll, setScroll] = useState(false);
  const [unmountDeselected, setUnmountDeselected] = useState(false);

  return (
    <BaseLayout
      title="Slide Container"
      scroll={scroll}
    >
      <ControlLayout>
        <ControlItem caption="position">
          <RadioButtons
            $unselectable
            $allowNull
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
        <ControlItem caption="direction">
          <RadioButtons
            $unselectable
            $allowNull
            $source={[
              { value: "horizontal", label: "horizontal" },
              { value: "horizontal-reverse", label: "horizontal-reverse" },
              { value: "vertical", label: "vertical" },
              { value: "vertical-reverse", label: "vertical-reverse" },
            ]}
            $value={direction}
            $onChange={v => setDirection(v!)}
          />
        </ControlItem>
        <ControlItem caption="breadcrumbs">
          <ToggleSwitch
            $value={breadcrumbs}
            $onChange={v => setBreadcrumbs(v!)}
          />
        </ControlItem>
        <ControlItem caption="overlap">
          <ToggleSwitch
            $value={overlap}
            $onChange={v => setOverlap(v!)}
          />
        </ControlItem>
        <ControlItem caption="scroll">
          <ToggleSwitch
            $value={scroll}
            $onChange={v => setScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="unmount">
          <ToggleSwitch
            $value={unmountDeselected}
            $onChange={v => setUnmountDeselected(v!)}
          />
        </ControlItem>
        <ControlItem caption="slide key">
          <BaseRow>
            <Button
              $fitContent
              onClick={() => setKey(undefined)}
            >
              unset
            </Button>
            {generateArray(5, idx => {
              return (
                <Button
                  key={idx}
                  $fitContent
                  onClick={() => setKey(`${idx}`)}
                >
                  {idx}
                </Button>
              );
            })}
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <SlideContainer
        $key={key}
        style={{
          width: "100%",
          flex: scroll ? "1 1 0rem" : undefined,
        }}
        $breadcrumbs={breadcrumbs}
        $overlap={overlap}
        $breadcrumbsPosition={position}
        $direction={direction}
        $unmountDeselected={unmountDeselected}
      >
        <SlideContent
          key="0"
          className="bgc-primary"
          $label="slide0"
        >
          <h2>slide 0</h2>
          {generateArray(10, (idx) => <h3 key={idx}>hoge</h3>)}
        </SlideContent>
        <SlideContent
          key="1"
          className="bgc-secondary"
          $label="slide1"
        >
          <h2>slide 1</h2>
          {generateArray(15, (idx) => <h3 key={idx}>fuga</h3>)}
        </SlideContent>
        <SlideContent
          key="2"
          className="bgc-tertiary"
          $label="slide2"
        >
          <h2>slide 2</h2>
          {generateArray(20, (idx) => <h3 key={idx}>piyo</h3>)}
        </SlideContent>
        <SlideContent
          key="3"
          className="bgc-sub"
          $label="slide3"
        >
          <h2>slide 3</h2>
          {generateArray(25, (idx) => <h3 key={idx}>kaco</h3>)}
        </SlideContent>
      </SlideContainer>
    </BaseLayout>
  );
};

export default Page;
