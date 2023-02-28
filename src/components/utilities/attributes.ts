import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import type { ReactElement, ReactFragment, ReactNode, ReactPortal } from "react";

export const joinClassNames = (...classNames: Array<string | null | undefined>) => {
  return StringUtils.join(" ", ...classNames);
};

export const attributes = (props: Struct, ...classNames: Array<string | null | undefined>) => {
  const ret: Struct = {};
  if (props) {
    Object.keys(props).forEach(key => {
      if (key[0] === "$") return;
      ret[key] = props[key];
    });
  }
  ret.className = StringUtils.join(" ", ...classNames, props.className) || undefined;
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
  if (value == null) return nullValue ?? undefined;
  if (typeof value === "string") return value;
  return `${convertPxToRemNum(value)!}rem`;
};

const pxPerRem = () => {
  if (typeof window === "undefined") return 10;
  return Number(parseFloat(getComputedStyle(document.documentElement).fontSize));
};

export const convertPxToRemNum = (value?: number) => {
  if (value == null) return undefined;
  return value / pxPerRem();
};

export const convertRemToPxNum = (value?: number) => {
  if (value == null) return undefined;
  return value * pxPerRem();
};

export const pressPositiveKey = <T extends HTMLElement = HTMLElement>(e: React.KeyboardEvent<T>, func: (e: React.KeyboardEvent<T>) => (void | boolean)) => {
  if (e.key === " " || e.key === "Enter") {
    if (func(e) !== true) {
      e.preventDefault();
    }
  }
};

const cursorStyleId = "cursorStyle";
export const setCursor = (cursor: string) => {
  if (document?.body == null) return () => { };
  document.onselectstart = () => false;
  let elem = document.getElementById(cursorStyleId) as HTMLStyleElement;
  if (elem == null) {
    elem = document.createElement("style");
    elem.id = cursorStyleId;
    elem.type = "text/css";
    document.head.appendChild(elem);
  }
  elem.textContent = `*,button,a{cursor:${cursor} !important;}`;
  return () => releaseCursor();
};

export const releaseCursor = () => {
  document.onselectstart = () => true;
  try {
    const elem = document.getElementById(cursorStyleId);
    if (elem == null) return;
    document.head.removeChild(elem);
  } catch { }
};