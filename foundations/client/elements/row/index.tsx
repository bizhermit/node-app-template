import { forwardRef, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import Style from "./index.module.scss";

type RowOptions = {
  $hAlign?: "left" | "center" | "right" | "stretch" | "around" | "between" | "evenly";
  $vAlign?: "top" | "middle" | "bottom" | "stretch";
  $nowrap?: boolean;
};

export type RowProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, RowOptions>;

const Row = forwardRef<HTMLDivElement, RowProps>(({
  className,
  $hAlign,
  $vAlign,
  $nowrap,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={joinCn(Style.main, className)}
      ref={ref}
      data-h={$hAlign || "left"}
      data-v={$vAlign || "top"}
      data-nowrap={$nowrap}
    />
  );
});

export default Row;