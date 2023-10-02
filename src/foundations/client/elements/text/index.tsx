import { forwardRef, type HTMLAttributes } from "react";
import { attributes, isReactNode } from "../../utilities/attributes";
import Style from "./index.module.scss";

type TextProps = HTMLAttributes<HTMLElement> & {
  $ib?: boolean; // inline-block
};

const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  if (props.children == null) return <></>;
  if (isReactNode(props.children)) return <>{props.children}</>;
  return (
    <span
      {...attributes(props, Style.main)}
      ref={ref}
      data-ib={props.$ib}
    />
  );
});

export default Text;