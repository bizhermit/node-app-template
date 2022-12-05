import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode } from "react";
import Style from "$/components/elements/badge.module.scss";
import LabelText from "@/components/elements/label-text";

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  $position?: "left-top" | "right-top" | "left-bottom" | "right-bottom";
  $size?: Size;
  children?: ReactNode;
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.main)}
      ref={ref}
      data-size={props.$size || "m"}
      data-pos={props.$position || "right-top"}
    >
      <LabelText>{props.children}</LabelText>
    </div>
  );
});

export default Badge;