"use client";

import NumberBox from "#/client/elements/form/items/number-box";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { MagnifyingGlassIcon } from "#/client/elements/icon";
import Stepper, { StepperProps } from "#/client/elements/stepper";
import Text from "#/client/elements/text";
import generateArray from "#/objects/array/generator";
import { sizes } from "#/utilities/sandbox";
import React, { ReactNode, useMemo, useState } from "react";
import BaseLayout from "../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../_components/control-layout";

const maxStep = 10;

const Page = () => {
  const [step, setStep] = useState(3);
  const [size, setSize] = useState<Size>("m");
  const [appearance, setAppearance] = useState<StepperProps["$appearance"]>();

  return (
    <BaseLayout title="Stepper">
      <ControlLayout>
        <ControlItem caption="step">
          <NumberBox
            style={{ width: "15rem" }}
            $required
            $value={step}
            $onChange={v => setStep(v ?? 0)}
            $min={0}
            $max={maxStep - 1}
          />
        </ControlItem>
        <ControlItem caption="size">
          <RadioButtons
            $source={sizes.map(size => {
              return { value: size, label: size };
            })}
            $value={size}
            $onChange={v => setSize(v!)}
          />
        </ControlItem>
        <ControlItem caption="appearance">
          <RadioButtons
            $unselectable
            $allowNull
            $source={[
              { value: "line", label: "line" },
              { value: "arrow", label: "arrow" }
            ]}
            $value={appearance}
            $onChange={v => setAppearance(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <Stepper
        style={{ width: "100%" }}
        $step={step}
        $appearance={appearance}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return `item${idx}`;
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
      <Stepper
        style={{ width: "100%" }}
        $step={step}
        $appearance={appearance}
        $color={{
          done: "pure",
          current: "primary",
          future: "secondary",
        }}
        $size={size}
      >
        {useMemo(() => {
          return generateArray(maxStep, idx => {
            return (
              <React.Fragment key={idx}>
                <MagnifyingGlassIcon />
                &nbsp;
                <Text>item{idx}</Text>
              </React.Fragment>
            );
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
    </BaseLayout>
  );
};

export default Page;
