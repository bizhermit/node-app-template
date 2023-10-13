import { forwardRef, type HTMLAttributes } from "react";
import { attributes, isReactNode } from "../../utilities/attributes";
import Style from "./index.module.scss";

type TextProps = HTMLAttributes<HTMLElement> & {
  $iblock?: boolean; // inline-block
  $block?: boolean; // block
  $bold?: boolean; // bold
};

const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  if (props.children == null) return <></>;
  if (isReactNode(props.children)) return <>{props.children}</>;
  return (
    <span
      {...attributes(props, Style.main)}
      ref={ref}
      data-iblock={props.$iblock}
      data-block={props.$block}
      data-bold={props.$bold}
    />
  );
});

export default Text;