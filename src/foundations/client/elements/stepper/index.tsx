"use client";

import { forwardRef, useImperativeHandle, useRef, type HTMLAttributes, type ReactNode } from "react";
import joinCn from "../../utilities/join-class-name";
import Text from "../text";
import Style from "./index.module.scss";

type StepState = "done" | "current" | "future" | "prev" | "next";

type StepperOptions = {
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

export type StepperProps = OverwriteAttrs<Omit<HTMLAttributes<HTMLDivElement>, "children">, StepperOptions>;

const Stepper = forwardRef<HTMLDivElement, StepperProps>(({
  className,
  $step,
  $appearance,
  $color,
  $size,
  children,
  ...props
}, $ref) => {
  const ref = useRef<HTMLInputElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const appearance = $appearance || "line";

  const getStateText = (index: number): StepState => {
    if (index === $step) return "current";
    if (index === $step - 1) return "prev";
    if (index < $step) return "done";
    if (index === $step + 1) return "next";
    return "future";
  };

  const getStateColor = (state: StepState) => {
    switch (state) {
      case "current":
        return $color?.current;
      case "done":
      case "prev":
        return $color?.done;
      default:
        return $color?.future;
    }
  };

  return (
    <div
      {...props}
      className={joinCn(Style.wrap, className)}
      ref={ref}
      data-appearance={appearance}
      data-size={$size || "m"}
    >
      {children.map((step, index) => {
        const state = getStateText(index);
        return (
          <div
            className={Style.step}
            key={index}
            data-state={state}
            data-color={getStateColor(state)}
          >
            {appearance === "arrow" ?
              <div className={Style.arrow}/> :
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
