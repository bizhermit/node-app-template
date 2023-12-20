import type { ReactElement, ReactFragment, ReactNode, ReactPortal } from "react";

export const isNotReactNode = (node: ReactNode, opts?: { ignoreBr: boolean; }): node is string | number | boolean => {
  if (Array.isArray(node)) {
    return !node.some(item => isReactNode(item));
  }
  const t = typeof node;
  if (opts?.ignoreBr && String((node as any)?.$$typeof) === "Symbol(react.element)" && (node as any)?.type === "br") {
    return true;
  }
  return t === "string" || t === "number" || t === "boolean";
};

export const isReactNode = (node: ReactNode, opts?: { ignoreBr: boolean; }): node is ReactElement | ReactFragment | ReactPortal | null | undefined => {
  return !isNotReactNode(node, opts);
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