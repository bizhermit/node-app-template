import { forwardRef, type HTMLAttributes } from "react";
import { attributesWithoutChildren, joinClassNames } from "../../utilities/attributes";
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
      ref={ref}
    >
      <div
        className={joinClassNames(Style.main, `c-${props.$color || "main"}`)}
        data-size={props.$size || "m"}
      >
        <Text>{props.children}</Text>
      </div>
    </div>
  );
});

export default Label;