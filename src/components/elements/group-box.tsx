import LabelText from "@/components/elements/label-text";
import { attributesWithoutChildren, joinClassNames } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode } from "react";
import Style from "$/components/elements/group-box.module.scss";

export type GroupBoxProps = HTMLAttributes<HTMLDivElement> & {
  $caption?: ReactNode;
  $bodyClassName?: string;
  $color?: Color;
};

const GroupBox = React.forwardRef<HTMLDivElement, GroupBoxProps>((props, ref) => {
  const borderColorClassName = `bdc-${props.$color || "border"}`;
  
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      {props.$caption &&
        <div className={`${Style.caption} fgc-${props.$color || "base"}`}>
          <div className={`${Style.prev} ${borderColorClassName}`} />
          <LabelText>
            {props.$caption}
          </LabelText>
          <div className={`${Style.next} ${borderColorClassName}`} />
        </div>
      }
      <div className={joinClassNames(Style.body, borderColorClassName, props.$bodyClassName)}>
        {props.children}
      </div>
    </div>
  );
});

export default GroupBox;