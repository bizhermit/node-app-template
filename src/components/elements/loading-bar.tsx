import { attributes } from "@/utilities/attributes";
import React, { FC, HTMLAttributes } from "react";
import Style from "$/components/elements/loading-bar.module.scss";
import usePortalElement from "@/hooks/portal-element";
import { createPortal } from "react-dom";

export type LoadingBarProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $fixed?: boolean;
};

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>((props, ref) => {
  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
      data-fixed={props.$fixed}
    >
      <div className={`${Style.bar} bgc-${props.$color || "main"}`} />
    </div>
  );
});

export default LoadingBar;

export const ScreenLoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>((props, ref) => {
  const portal = usePortalElement({
    mount: (elem) => {
      elem.classList.add(Style.root);
    }
  });

  if (portal == null) return <></>;
  return createPortal(<LoadingBar {...props} ref={ref} $fixed />, portal);
});