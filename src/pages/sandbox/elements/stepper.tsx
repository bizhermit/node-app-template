import Divider from "@/components/elements/divider";
import NumberBox from "@/components/elements/form-items/number-box";
import Row from "@/components/elements/row";
import Stepper from "@/components/elements/stepper";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { ReactNode, useMemo, useState } from "react";

const maxStep = 10;

const Page: NextPage = () => {
  const [step, setStep] = useState(3);


  return (
    <div className="flex-box flex-start w-100 h-100 p-1 gap-1">
      <Row>
        <NumberBox
          $required
          $value={step}
          $onChange={v => setStep(v ?? 0)}
          $min={0}
          $max={maxStep - 1}
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
      >
        {useMemo(() => {
          return ArrayUtils.generateArray(maxStep, idx => {
            return `item${idx}`;
          }) as [ReactNode, ...Array<ReactNode>];
        }, [maxStep])}
      </Stepper>
    </div>
  );
};

export default Page;