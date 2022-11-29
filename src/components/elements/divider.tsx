import React, { HTMLAttributes, ReactNode } from "react";
import { attributesWithoutChildren, convertSizeNumToStr } from "@/utilities/attributes";
import Style from "$/components/elements/divider.module.scss";
import LabelText from "@/pages/sandbox/elements/label-text";

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $height?: number | string;
  color?: Color;
  children?: ReactNode;
  $align?: "left" | "center" | "right";
};

const Divider = React.forwardRef<HTMLDivElement, DividerProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      <div
        className={`${Style.border} bgc-${props.$color || "border"}`}
        style={{ height: convertSizeNumToStr(props.$height, "") }}
      />
      {props.children &&
        <div
          className={Style.children}
          data-align={props.$align || "center"}
        >
          <LabelText className={Style.text}>{props.children}</LabelText>
        </div>
      }
    </div>
  );
});

export default Divider;