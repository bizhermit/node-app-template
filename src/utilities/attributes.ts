import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import React, { ReactElement, ReactFragment, ReactNode, ReactPortal } from "react";

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

export const convertSizeNumToStr = (value?: string | number | null, nullValue?: string | (() => void)) => {
  if (value == null) {
    if (nullValue == null || typeof nullValue === "string") return nullValue ?? "";
    nullValue();
    return "";
  }
  if (typeof value === "string") return value;
  return `${value / 10}rem`;
};

export const pressPositiveKey = <T extends HTMLElement = HTMLElement>(e: React.KeyboardEvent<T>, func: (e: React.KeyboardEvent<T>) => (void | boolean)) => {
  if (e.key === " " || e.key === "Enter") {
    if (func(e) !== true) {
      e.preventDefault();
    }
  }
};