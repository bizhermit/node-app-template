import { forwardRef, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import Text from "../text";
import Style from "./index.module.scss";

type BadgeOptions = {
  $position?: "left-top" | "right-top" | "left-bottom" | "right-bottom";
  $round?: boolean;
  $size?: Size;
  $color?: Color;
  $preventElevatation?: boolean;
};

export type BadgeProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, BadgeOptions>;

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  $position,
  $round,
  $size,
  $color,
  $preventElevatation,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={joinCn(Style.main, className)}
      ref={ref}
      data-size={$size || "m"}
      data-pos={$position || "right-top"}
      data-round={$round}
      data-color={$color}
      data-elevatation={!$preventElevatation}
    >
      <Text>{props.children}</Text>
    </div>
  );
});

export default Badge;