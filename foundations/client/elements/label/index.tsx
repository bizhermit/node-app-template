import { forwardRef, type HTMLAttributes } from "react";
import strJoin from "../../../objects/string/join";
import Text from "../text";
import Style from "./index.module.scss";

type LabelOptions = {
  $color?: Color;
  $size?: Size;
};

type LabelProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, LabelOptions>;

const Label = forwardRef<HTMLDivElement, LabelProps>(({
  className,
  $color,
  $size,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={strJoin(" ", Style.wrap, className)}
      ref={ref}
      data-color={$color}
    >
      <div
        className={Style.main}
        data-size={$size || "m"}
      >
        <Text>{props.children}</Text>
      </div>
    </div>
  );
});

export default Label;