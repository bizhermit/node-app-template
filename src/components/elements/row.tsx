import Style from "$/components/elements/row.module.scss";
import { attributes } from "@/components/utilities/attributes";
import React, { HTMLAttributes } from "react";

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  $hAlign?: "left" | "center" | "right" | "stretch" | "around" | "between" | "evenly";
  $vAlign?: "top" | "middle" | "bottom" | "stretch";
  $nowrap?: boolean;
};

const Row = React.forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
      data-h={props.$hAlign || "left"}
      data-v={props.$vAlign || "middle"}
      data-nowrap={props.$nowrap}
    />
  );
});

export default Row;