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
