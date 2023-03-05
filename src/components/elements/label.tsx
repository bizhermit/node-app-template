import { attributesWithoutChildren, joinClassNames } from "@/components/utilities/attributes";
import Text from "@/components/elements/text";
import { forwardRef, type HTMLAttributes } from "react";
import Style from "$/components/elements/label.module.scss";

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
        className={joinClassNames(Style.main, `c-${props.$color || "danger"}`)}
        data-size={props.$size}
      >
        <Text>{props.children}</Text>
      </div>
    </div>
  );
});

export default Label;