import { attributes, isReactNode } from "#/components/utilities/attributes";
import type { FC, HTMLAttributes } from "react";

const Text: FC<HTMLAttributes<HTMLSpanElement>> = (props) => {
  if (props.children == null) return <></>;
  if (isReactNode(props.children)) return <>{props.children}</>;
  return <span {...attributes(props, "pt-t")} />;
};

export default Text;