import { CloudIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import Stepper from "#/client/elements/stepper";
import generateArray from "#/objects/array/generator";
import StepperClient from "@/sandbox/elements/stepper/_components/client";
import { ReactNode } from "react";

const Page = () => {
  return (
    <>
      <div className="flex column w-100 p-l">
        <Stepper
          className="w-100"
          $step={3}
          children={generateArray(10, idx => {
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