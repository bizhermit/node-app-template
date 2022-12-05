import Divider from "@/components/elements/divider";
import NumberBox from "@/components/elements/form-items/number-box";
import Row from "@/components/elements/row";
import Stepper from "@/components/elements/stepper";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { ReactNode, useMemo, useState } from "react";

const maxStep = 20;

const Page: NextPage = () => {
  const [step, setStep] = useState(0);


  return (
    <div className="flex-box flex-start w-100 h-100 p-1 gap-1">
      <Row>
        <NumberBox
          $required
          $value={step}
          $onChange={v => setStep(v ?? 0)}
          $min={0}
          $max={maxStep}
        />
      </Row>
      <Divider />
      <Stepper
        className="w-100"
        $step={0}
        $appearance="line"
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
        $step={0}
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