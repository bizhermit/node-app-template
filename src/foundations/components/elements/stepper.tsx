import Style from "#/styles/components/elements/stepper.module.scss";
import Text from "#/components/elements/text";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import { forwardRef, type HTMLAttributes, type ReactNode, useImperativeHandle, useRef } from "react";

export type StepState = "done" | "current" | "future";

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
              <Text>{step}</Text>
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