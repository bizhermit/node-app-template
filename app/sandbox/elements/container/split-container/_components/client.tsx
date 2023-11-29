"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import SplitContainer, { type SplitDirection } from "#/client/elements/split-container";
import SplitContent from "#/client/elements/split-container/content";
import generateArray from "#/objects/array/generator";
import { useState } from "react";

const SplitContainerClient = () => {
  const [direction, setDirection] = useState<SplitDirection>();
  const [reverse, setReverse] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [hide1, setHide1] = useState(false);
  const [hide2, setHide2] = useState(false);

  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <Row $vAlign="bottom" className="g-s">
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
        className={`w-100${scroll ? " flex-11" : ""}`}
        $disabled={disabled}
        $direction={direction}
        $reverse={reverse}
        $hide1={hide1}
        $hide2={hide2}
      // $bodyColor="pure"
      // $defaultMount
      // $unmountDeselected
      >
        <div className="box w-100 h-100 px-s c-primary">
          <h1>Cotent 1</h1>
          <Button
            $outline
            $onClick={() => {
              alert("content1");
            }}
          />
          {generateArray(10, (idx) => (
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
          <div className="box w-100 h-100 px-s c-secondary">
            <h1>Content2 2</h1>
            <Button
              $outline
              $onClick={() => {
                alert("content2");
              }}
            />
            {generateArray(15, (idx) => (
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