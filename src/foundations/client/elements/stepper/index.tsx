"use client";

import { forwardRef, useImperativeHandle, useRef, type HTMLAttributes, type ReactNode } from "react";
import { attributesWithoutChildren } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

export type StepState = "done" | "current" | "future" | "prev" | "next";

type OmitAttributes = "color" | "children";
export type StepperProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
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

const Stepper = forwardRef<HTMLDivElement, StepperProps>((props, $ref) => {
  const ref = useRef<HTMLInputElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const appearance = props.$appearance || "line";

  const getStateText = (index: number) => {
    if (index === props.$step) return "current";
    if (index === props.$step - 1) return "prev";
    if (index < props.$step) return "done";
    if (index === props.$step + 1) return "next";
    return "future";
  };

  const getStateColor = (state: StepState) => {
    switch (state) {
      case "current":
        return props.$color?.current || "main";
      case "done":
      case "prev":
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
            {appearance === "arrow" ?
              <div className={`${Style.arrow} c-${color}`} /> :
              <div className={Style.line}>
                <div className={`${Style.point} bgc-${color}`} />
              </div>
            }
            <div
              className={`${Style.label}${appearance === "arrow" ? ` fgc-${color}_r` : ""}`}
            >
              <Text>{step}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default Stepper;