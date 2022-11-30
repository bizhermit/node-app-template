import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { ReactElement, ReactFragment, ReactNode, ReactPortal } from "react";

export const attributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret: Struct = {
    ...props,
    className: StringUtils.join(" ", ...classNames, props.className),
  };
  Object.keys(ret).forEach(key => {
    if (key[0] === "$") delete ret[key];
  });
  return ret;
};

export const attributesWithoutChildren = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret = attributes(props, ...classNames);
  if ("children" in ret) delete ret.children;
  return ret;
};

export const isNotReactNode = (node: ReactNode): node is string | number | boolean => {
  const t = typeof node;
  return t === "string" || t === "number" || t === "boolean";
};

export const isReactNode = (node: ReactNode): node is ReactElement | ReactFragment | ReactPortal | null | undefined => {
  return !isNotReactNode(node);
};

export const convertSizeNumToStr = (value?: string | number | null, nullValue?: string) => {
  if (value == null) return nullValue ?? "";
  if (typeof value === "string") return value;
  return `${value / 10}rem`;
};