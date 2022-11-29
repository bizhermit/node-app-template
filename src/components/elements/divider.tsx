import React, { HTMLAttributes, ReactNode } from "react";
import { attributesWithoutChildren, convertSizeNumToStr } from "@/utilities/attributes";
import Style from "$/components/elements/divider.module.scss";
import LabelText from "@/pages/sandbox/elements/label-text";

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $reverseColor?: boolean;
  $height?: number | string;
  children?: ReactNode;
  $align?: "left" | "center" | "right";
};

const Divider = React.forwardRef<HTMLDivElement, DividerProps>((props, ref) => {
  const align = props.children ? props.$align || "center" : undefined;
  const colorClassName = `bgc-${props.$color || "border"}${props.$reverseColor ? "_r" : ""}`;

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      <div
        className={`${Style.border} ${colorClassName}`}
        style={{ height: convertSizeNumToStr(props.$height, "") }}
        data-short={align === "left"}
      />
      {props.children &&
        <>
          <div className={Style.children}>
            <LabelText className={Style.text}>{props.children}</LabelText>
          </div>
          <div
            className={`${Style.border} ${colorClassName}`}
            style={{ height: convertSizeNumToStr(props.$height, "") }}
            data-short={align === "right"}
          />
        </>
      }
    </div>
  );
});

export default Divider;