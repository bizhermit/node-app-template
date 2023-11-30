import { forwardRef, type HTMLAttributes } from "react";
import { appendedColorStyle, attributesWithoutChildren } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type LabelProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  $color?: Color;
  $size?: Size;
};

const Label = forwardRef<HTMLDivElement, LabelProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      style={appendedColorStyle(props)}
      ref={ref}
    >
      <div
        className={Style.main}
        data-size={props.$size || "m"}
      >
        <Text>{props.children}</Text>
      </div>
    </div>
  );
});

export default Label;