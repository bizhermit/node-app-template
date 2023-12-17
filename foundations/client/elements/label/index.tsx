import { forwardRef, type HTMLAttributes } from "react";
import { attrs } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type LabelProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  $color?: Color;
  $size?: Size;
};

const Label = forwardRef<HTMLDivElement, LabelProps>(({
  $color,
  $size,
  ...props
}, ref) => {
  return (
    <div
      {...attrs(props, Style.wrap)}
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