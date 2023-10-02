import { forwardRef, type HTMLAttributes } from "react";
import { attributes } from "../../utilities/attributes";
import Style from "./index.module.scss";

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