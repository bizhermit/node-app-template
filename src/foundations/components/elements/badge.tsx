import Style from "#/styles/components/elements/badge.module.scss";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import { forwardRef, type HTMLAttributes } from "react";
import Text from "#/components/elements/text";

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
      <Text>{props.children}</Text>
    </div>
  );
});

export default Badge;