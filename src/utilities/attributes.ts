import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { ReactNode } from "react";

export const attributes = (props: Struct, ...classNames: Array<string>) => {
  const ret: Struct = {
    ...props,
    className: StringUtils.join(" ", ...classNames, props.className),
  };
  Object.keys(ret).forEach(key => {
    if (key[0] === "$") delete ret[key];
  });
  return ret;
};

export const attributesWithoutChildren = (props: Struct, ...classNames: Array<string>) => {
  const ret = attributes(props, ...classNames);
  if ("children" in ret) delete ret.children;
  return ret;
};

export const inputAttributes = (props: Struct, ...classNames: Array<string>) => {
  const ret = attributesWithoutChildren(props, ...classNames);
  if ("tabIndex" in ret) delete ret.tabIndex;
  return ret;
};

export const isReactNode = (node: ReactNode) => {
  const t = typeof node;
  return !(t === "string" || t === "number" || t === "boolean");
};