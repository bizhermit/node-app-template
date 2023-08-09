import { CloudIcon } from "#/components/elements/icon";
import Row from "#/components/elements/row";
import Stepper from "#/components/elements/stepper";
import StepperClient from "@/sandbox/elements/stepper/_components/client";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { ReactNode } from "react";

const Page = () => {
  return (
    <>
      <div className="flex-stretch w-100 p-l">
        <Stepper
          className="w-100"
          $step={3}
          children={ArrayUtils.generateArray(10, idx => {
            return (
              <Row key={idx} className="g-s">
                <CloudIcon />
                <span className="box pt-t">C-{idx}</span>
              </Row>
            );
          }) as [ReactNode, ...ReactNode[]]}
        />
      </div>
      <StepperClient />
    </>
  );
};

export default Page;