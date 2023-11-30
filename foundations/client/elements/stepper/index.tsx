"use client";

import { forwardRef, useImperativeHandle, useRef, type HTMLAttributes, type ReactNode } from "react";
import { appendedColorStyle, attributesWithoutChildren } from "../../utilities/attributes";
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
        return props.$color?.current;
      case "done":
      case "prev":
        return props.$color?.done;
      default:
        return props.$color?.future;
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

        return (
          <div
            className={Style.step}
            style={appendedColorStyle({ $color: getStateColor(state) })}
            key={index}
            data-state={state}
            data-appearance={appearance}
          >
            {appearance === "arrow" ?
              <div className={Style.arrow} /> :
              <div className={Style.line}>
                <div className={Style.point} />
              </div>
            }
            <div className={Style.label}>
              <Text>{step}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default Stepper;