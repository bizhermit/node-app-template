"use client";

import Divider from "#/client/elements/divider";
import NumberBox from "#/client/elements/form/items/number-box";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { CloudIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import Stepper from "#/client/elements/stepper";
import generateArray from "#/objects/array/generator";
import { sizes } from "#/utilities/sandbox";
import { useMemo, useState, type ReactNode } from "react";

const maxStep = 10;

const StepperClient = () => {
  const [step, setStep] = useState(3);
  const [size, setSize] = useState<Size>("m");

  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <Row>
        <NumberBox
          $required
          $value={step}
          $onChange={v => setStep(v ?? 0)}
          $min={0}
          $max={maxStep - 1}
        />
        <RadioButtons
          $source={sizes.map(size => {
            return { value: size, label: size };
          })}
          $value={size}
          $onChange={v => setSize(v!)}
        />
      </Row>
      <Divider />
      <Stepper
        className="w-100"
        $step={step}
        $appearance="line"
        $color={{
          // done: "base",
          // current: "danger",
          // future: "warning",
        }}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return `item${idx}`;
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
      <Stepper
        className="w-100"
        $appearance="arrow"
        $step={step}
        $color={{
          // done: "cool",
          // current: "primary",
          // future: "secondary",
        }}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return `item${idx}`;
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
      <Stepper
        className="w-100"
        $step={step}
        $appearance="line"
        $color={{
          // done: "base",
          // current: "danger",
          // future: "warning",
        }}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return (
              <Row key={idx} className="g-s">
                <CloudIcon />
                <span className="box pt-t">{idx}</span>
              </Row>
            );
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
      <Stepper
        className="w-100"
        $appearance="arrow"
        $step={step}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return (
              <Row key={idx} className="g-s">
                <CloudIcon />
                <span className="box pt-t">{idx}</span>
              </Row>
            );
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
    </div>
  );
};

export default StepperClient;