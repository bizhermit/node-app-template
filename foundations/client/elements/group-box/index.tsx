import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { attributesWithoutChildren, joinClassNames } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type OmitAttributes = "color";
export type GroupBoxProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $caption?: ReactNode;
  $bodyClassName?: string;
  $color?: Color;
};

const GroupBox = forwardRef<HTMLDivElement, GroupBoxProps>((props, ref) => {
  const borderColorClassName = `bdc-${props.$color || "border"}`;

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      {props.$caption &&
        <div className={`${Style.caption} fgc-${props.$color || "base"}`}>
          <div className={`${Style.prev} ${borderColorClassName}`} />
          <Text>
            {props.$caption}
          </Text>
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