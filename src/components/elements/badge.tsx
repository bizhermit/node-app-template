import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode } from "react";
import Style from "$/components/elements/badge.module.scss";

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
    >

    </div>
  );
});

export default Badge;