import Style from "$/components/elements/stepper.module.scss";
import LabelText from "@/components/elements/label-text";
import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode, useImperativeHandle, useRef } from "react";

export type StepState = "done" | "current" | "future";

export type StepperProps = HTMLAttributes<HTMLDivElement> & {
  $step: number;
  $appearance?: "line" | "arrow";
  $color?: {
    done?: Color;
    current?: Color;
    future?: Color;
  };
  $size?: Size;
  children: [ReactNode, ...Array<ReactNode>];
};

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>((props, $ref) => {
  const ref = useRef<HTMLInputElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const appearance = props.$appearance || "line";

  const getStateText = (index: number) => {
    if (index === props.$step) return "current";
    if (index < props.$step) return "done";
    return "future";
  };

  const getStateColor = (state: StepState) => {
    switch (state) {
      case "current":
        return props.$color?.current || "main";
      case "done":
        if (appearance === "line") return props.$color?.done || "input";
        return props.$color?.done || "input";
      default:
        if (appearance === "line") return props.$color?.future || "input";
        return props.$color?.future || "input";
    }
  };

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-appearance={appearance}
      data-size={props.$size || "m"}
    >
      {props.children.map((step, index) => {
        const state = getStateText(index);
        const color = getStateColor(state);

        return (
          <div
            className={Style.step}
            key={index}
            data-state={state}
            data-appearance={appearance}
          >
            <div
              className={`${Style.label}${appearance === "arrow" ? ` fgc-${color}_r` : ""}`}
            >
              <LabelText>{step}</LabelText>
            </div>
            {appearance === "arrow" ?
              <div className={`${Style.arrow} c-${color}`} /> :
              <div className={Style.line}>
                <div className={`${Style.point} bgc-${color}`} />
              </div>
            }
          </div>
        );
      })}
    </div>
  );
});

export default Stepper;