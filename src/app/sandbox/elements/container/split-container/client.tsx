"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import RadioButtons from "#/components/elements/form/items/radio-buttons";
import ToggleBox from "#/components/elements/form/items/toggle-box";
import Row from "#/components/elements/row";
import SplitContainer, { SplitContent, type SplitDirection } from "#/components/elements/split-container";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { useState } from "react";

const SplitContainerClient = () => {
  const [direction, setDirection] = useState<SplitDirection>();
  const [reverse, setReverse] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [hide1, setHide1] = useState(false);
  const [hide2, setHide2] = useState(false);

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <Row $vAlign="bottom" className="gap-1">
        <ToggleBox
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <RadioButtons
          $tag="split direction"
          $source={[
            { value: "horizontal", label: "horizontal" },
            { value: "vertical", label: "vertical" },
          ]}
          $value={direction}
          $onChange={v => setDirection(v!)}
        />
        <ToggleBox
          $tag="reverse"
          $value={reverse}
          $onChange={v => setReverse(v!)}
        />
        <ToggleBox
          $tag="scroll"
          $value={scroll}
          $onChange={v => setScroll(v!)}
        />
        <ToggleBox
          $tag="hide1"
          $value={hide1}
          $onChange={v => setHide1(v!)}
        />
        <ToggleBox
          $tag="hide2"
          $value={hide2}
          $onChange={v => setHide2(v!)}
        />
      </Row>
      <Divider />
      <SplitContainer
        className={`w-100${scroll ? " flex-1_1_0" : ""}`}
        $disabled={disabled}
        $direction={direction}
        $reverse={reverse}
        $hide1={hide1}
        $hide2={hide2}
      // $bodyColor="pure"
      // $defaultMount
      // $unmountDeselected
      >
        <div className="box w-100 h-100 px-1 c-primary">
          <h1>Cotent 1</h1>
          <Button
            $outline
            $onClick={() => {
              alert("content1");
            }}
          />
          {ArrayUtils.generateArray(10, (idx) => (
            <Row key={idx}>
              <h2>piyo {idx}</h2>
            </Row>
          ))}
        </div>
        <SplitContent
          defaultSize="40%"
          minSize="10%"
          maxSize="80%"
        >
          <div className="box w-100 h-100 px-1 c-secondary">
            <h1>Content2 2</h1>
            <Button
              $outline
              $onClick={() => {
                alert("content2");
              }}
            />
            {ArrayUtils.generateArray(15, (idx) => (
              <Row key={idx}>
                <h2>fuga {idx}</h2>
              </Row>
            ))}
          </div>
        </SplitContent>
      </SplitContainer>
    </div>
  );
};

export default SplitContainerClient;