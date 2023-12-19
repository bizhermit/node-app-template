import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import joinCn from "../../utilities/join-class-name";
import Text from "../text";
import Style from "./index.module.scss";

type GroupContainerOptions = {
  $caption?: ReactNode;
  $bodyClassName?: string;
  $color?: Color;
};

export type GroupContainerProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, GroupContainerOptions>;

const GroupContainer = forwardRef<HTMLDivElement, GroupContainerProps>(({
  className,
  $caption,
  $bodyClassName,
  $color,
  children,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={joinCn(Style.wrap, className)}
      ref={ref}
      data-color={$color}
    >
      {$caption &&
        <div className={Style.caption}>
          <div className={Style.prev} />
          <Text>
            {$caption}
          </Text>
          <div className={Style.next} />
        </div>
      }
      <div className={joinCn(Style.body, $bodyClassName)}>
        {children}
      </div>
    </div>
  );
});

export default GroupContainer;