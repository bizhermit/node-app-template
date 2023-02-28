import Divider from "@/components/elements/divider";
import NumberBox from "@/components/elements/form-items/number-box";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import Row from "@/components/elements/row";
import Stepper from "@/components/elements/stepper";
import { sizes } from "@/utilities/sandbox";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import type { NextPage } from "next";
import { type ReactNode, useMemo, useState } from "react";
import { VscAccount } from "react-icons/vsc";

const maxStep = 10;

const Page: NextPage = () => {
  const [step, setStep] = useState(3);
  const [size, setSize] = useState<Size>("m");

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
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
          return ArrayUtils.generateArray(maxStep, idx => {
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
          return ArrayUtils.generateArray(maxStep, idx => {
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
          return ArrayUtils.generateArray(maxStep, idx => {
            return (
              <Row key={idx} className="gap-1">
                <VscAccount />
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
          return ArrayUtils.generateArray(maxStep, idx => {
            return (
              <Row key={idx} className="gap-1">
                <VscAccount />
                <span className="box pt-t">{idx}</span>
              </Row>
            );
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
    </div>
  );
};

export default Page;