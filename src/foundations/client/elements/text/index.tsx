import { forwardRef, type HTMLAttributes } from "react";
import joinCn from "../../utilities/join-class-name";
import { isReactNode } from "../../utilities/react-node";
import Style from "./index.module.scss";

type TextOptions = {
  $iblock?: boolean; // inline-block
  $block?: boolean; // block
  $bold?: boolean; // bold
};

type TextProps = OverwriteAttrs<HTMLAttributes<HTMLElement>, TextOptions>;

const Text = forwardRef<HTMLElement, TextProps>(({
  className,
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
      {...props}
      className={joinCn(Style.main, className)}
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