import { forwardRef, type HTMLAttributes } from "react";
import { attrs, isReactNode } from "../../utilities/attributes";
import Style from "./index.module.scss";

type TextOptions = {
  $iblock?: boolean; // inline-block
  $block?: boolean; // block
  $bold?: boolean; // bold
};

type TextProps = OverwriteAttrs<HTMLAttributes<HTMLElement>, TextOptions>;

const Text = forwardRef<HTMLElement, TextProps>(({
  $iblock,
  $block,
  $bold,
  children,
  ...props
}, ref) => {
  if (children == null) return <></>;
  if (isReactNode(children)) return <>{children}</>;
  return (
    <span
      {...attrs(props, Style.main)}
      ref={ref}
      data-iblock={$iblock}
      data-block={$block}
      data-bold={$bold}
    >
      {children}
    </span>
  );
});

export default Text;