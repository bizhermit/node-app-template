import Style from "$/components/templates/row.module.scss";
import { attributes } from "@/utilities/attributes";
import React, { HTMLAttributes, LegacyRef } from "react";

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  $hAlign?: "left" | "center" | "right" | "stretch" | "around" | "between" | "evenly";
  $vAlign?: "top" | "middle" | "bottom" | "stretch";
  $nowrap?: boolean;
};

const Row = React.forwardRef<HTMLButtonElement, RowProps>((props, ref) => {
  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref as LegacyRef<HTMLDivElement>}
      data-h={props.$hAlign || "left"}
      data-v={props.$vAlign || "middle"}
      data-nowrap={props.$nowrap}
    />
  );
});

export default Row;