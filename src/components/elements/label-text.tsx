import { isReactNode } from "@/components/utilities/attributes";
import { FC, HTMLAttributes } from "react";

const LabelText: FC<HTMLAttributes<HTMLSpanElement>> = (props) => {
  if (props.children == null) return <></>;
  if (isReactNode(props.children)) return <>{props.children}</>;
  return <span {...props} className={props.className ?? "pt-t"}>{props.children}</span>;
};

export default LabelText;