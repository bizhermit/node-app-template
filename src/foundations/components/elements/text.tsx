import { attributes, isReactNode } from "#/components/utilities/attributes";
import { forwardRef, type HTMLAttributes } from "react";

const Text = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>((props, ref) => {
  if (props.children == null) return <></>;
  if (isReactNode(props.children)) return <>{props.children}</>;
  return <span {...attributes(props, "pt-t")} ref={ref} />;
});

export default Text;