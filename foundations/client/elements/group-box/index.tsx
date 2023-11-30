import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { appendedColorStyle, attributesWithoutChildren, joinClassNames } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type OmitAttributes = "color";
export type GroupBoxProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $caption?: ReactNode;
  $bodyClassName?: string;
  $color?: Color;
};

const GroupBox = forwardRef<HTMLDivElement, GroupBoxProps>((props, ref) => {
  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      style={appendedColorStyle(props, true)}
      ref={ref}
    >
      {props.$caption &&
        <div className={Style.caption}>
          <div className={Style.prev} />
          <Text>
            {props.$caption}
          </Text>
          <div className={Style.next} />
        </div>
      }
      <div className={joinClassNames(Style.body, props.$bodyClassName)}>
        {props.children}
      </div>
    </div>
  );
});

export default GroupBox;