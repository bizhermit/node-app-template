"use client";

import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import SplitContainer, { SplitContent } from "#/client/elements/split-container";
import generateArray from "#/objects/array/generator";
import BaseLayout from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const Page = () => {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(null!);
  const [reverse, setReverse] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [hide0, setHide0] = useState(false);
  const [hide1, setHide1] = useState(false);

  return (
    <BaseLayout
      title="Slide Container"
      scroll={scroll}
    >
      <ControlLayout>
        <ControlItem caption="direction">
          <RadioButtons
            $unselectable
            $allowNull
            $source={[
              { value: "horizontal", label: "horizontal" },
              { value: "vertical", label: "vertical" },
            ]}
            $value={direction}
            $onChange={v => setDirection(v!)}
          />
        </ControlItem>
        <ControlItem caption="reverse">
          <ToggleBox
            $value={reverse}
            $onChange={v => setReverse(v!)}
          />
        </ControlItem>
        <ControlItem caption="disabled">
          <ToggleBox
            $value={disabled}
            $onChange={v => setDisabled(v!)}
          />
        </ControlItem>
        <ControlItem caption="scroll">
          <ToggleBox
            $value={scroll}
            $onChange={v => setScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="hide0">
          <ToggleBox
            $value={hide0}
            $onChange={v => setHide0(v!)}
          />
        </ControlItem>
        <ControlItem caption="hide1">
          <ToggleBox
            $value={hide1}
            $onChange={v => setHide1(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <SplitContainer
        style={{
          width: "100%",
          flex: scroll ? "1 1 0rem" : undefined,
        }}
        $disabled={disabled}
        $direction={direction}
        $reverse={reverse}
        $hide0={hide0}
        $hide1={hide1}
      >
        <SplitContent
          className="bgc-primary"
        >
          <h2>split 0</h2>
          {generateArray(10, (idx) => <h3 key={idx}>hoge</h3>)}
        </SplitContent>
        <SplitContent
          className="bgc-secondary"
          // $defaultSize="40%"
          // $minSize="10%"
          // $maxSize="80%"
        >
          <h2>split 1</h2>
          {generateArray(15, (idx) => <h3 key={idx}>fuga</h3>)}
        </SplitContent>
      </SplitContainer>
    </BaseLayout>
  );
};

export default Page;