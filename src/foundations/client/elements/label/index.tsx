import { forwardRef, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import Text from "../text";
import Style from "./index.module.scss";

type LabelOptions = {
  $color?: Color;
  $size?: Size;
  $outline?: boolean;
};

type LabelProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, LabelOptions>;

const Label = forwardRef<HTMLDivElement, LabelProps>(({
  className,
  $color,
  $size,
  children,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={joinCn(Style.main, className)}
      ref={ref}
      data-color={$color}
      data-size={$size || "m"}
    >
      <Text>{children}</Text>
    </div>
  );
});

export default Label;
