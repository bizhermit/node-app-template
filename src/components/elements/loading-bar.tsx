import { attributes } from "@/utilities/attributes";
import React, { HTMLAttributes } from "react";
import Style from "$/components/elements/loading-bar.module.scss";

export type LoadingBarProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
};

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>((props, ref) => {
  return (
    <div {...attributes(props, Style.wrap)}>

    </div>
  );
});

export default LoadingBar;