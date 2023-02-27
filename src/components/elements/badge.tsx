import { attributesWithoutChildren } from "@/components/utilities/attributes";
import { forwardRef, HTMLAttributes } from "react";
import Style from "$/components/elements/badge.module.scss";
import LabelText from "@/components/elements/label-text";

type OmitAttributes = "color";
export type BadgeProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $position?: "left-top" | "right-top" | "left-bottom" | "right-bottom";
  $size?: Size;
};

const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
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