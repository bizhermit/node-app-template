import { forwardRef, type HTMLAttributes } from "react";
import { attrs, convertSizeNumToStr } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type DividerOptions = {
  $color?: Color;
  $reverseColor?: boolean;
  $height?: number | string;
  $align?: "left" | "center" | "right";
  $shortWidth?: number | string;
};

export type DividerProps = OverwriteAttrs<HTMLAttributes<HTMLDivElement>, DividerOptions>;

const Divider = forwardRef<HTMLDivElement, DividerProps>(({
  $color,
  $reverseColor,
  $height,
  $align,
  $shortWidth,
  children,
  ...props
}, ref) => {
  const align = children ? $align || "center" : undefined;

  return (
    <div
      {...attrs(props, Style.wrap)}
      ref={ref}
      data-color={$color}
    >
      <div
        className={Style.border}
        style={{
          height: convertSizeNumToStr($height),
          width: align === "left" ? convertSizeNumToStr($shortWidth) : undefined,
        }}
        data-reverse={$reverseColor}
        data-short={align === "left"}
      />
      {children &&
        <>
          <div className={Style.children}>
            <Text className={Style.text}>{children}</Text>
          </div>
          <div
            className={Style.border}
            style={{
              height: convertSizeNumToStr($height),
              width: align === "right" ? convertSizeNumToStr($shortWidth) : undefined,
            }}
            data-reverse={$reverseColor}
            data-short={align === "right"}
          />
        </>
      }
    </div>
  );
});

export default Divider;