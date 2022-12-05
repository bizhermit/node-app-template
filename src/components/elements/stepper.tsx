import Style from "$/components/elements/stepper.module.scss";
import LabelText from "@/components/elements/label-text";
import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode, useImperativeHandle, useRef } from "react";

export type StepperProps = HTMLAttributes<HTMLDivElement> & {
  $step: number;
  $appearance?: "line" | "arrow";
  children: [ReactNode, ...Array<ReactNode>];
};

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>((props, $ref) => {
  const ref = useRef<HTMLInputElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const appearance = props.$appearance || "line";

  console.log(props.children);
  const getStateText = (index: number) => {
    if (index === props.$step) return "current";
    if (index < props.$step) return "done";
    return "future";
  }

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      {props.children.map((step, index) => {
        const state = getStateText(index);
        return (
          <div
            className={Style.step}
            key={index}
            data-state={state}
            data-appearance={appearance}
          >
            <div className={Style.label}>
              <LabelText>{step}</LabelText>
            </div>
            {appearance === "arrow" ?
              <div className={Style.arrow} /> :
              <div className={Style.line}>
                <div className={Style.point} />
              </div>
            }
          </div>
        );
      })}
    </div>
  );
});

export default Stepper;