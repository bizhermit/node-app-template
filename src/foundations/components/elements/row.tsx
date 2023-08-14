import Style from "#/styles/components/elements/row.module.scss";
import { attributes } from "#/components/utilities/attributes";
import { forwardRef, type HTMLAttributes } from "react";

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  $hAlign?: "left" | "center" | "right" | "stretch" | "around" | "between" | "evenly";
  $vAlign?: "top" | "middle" | "bottom" | "stretch";
  $nowrap?: boolean;
};

const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  return (
    <div
      {...attributes(props, Style.main)}
      ref={ref}
      data-h={props.$hAlign || "left"}
      data-v={props.$vAlign || "top"}
      data-nowrap={props.$nowrap}
    />
  );
});

export default Row;