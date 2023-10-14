import { forwardRef, type HTMLAttributes } from "react";
import { attributesWithoutChildren, convertSizeNumToStr } from "../../utilities/attributes";
import Text from "../text";
import Style from "./index.module.scss";

type OmitAttributes = "color";
export type DividerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $color?: Color;
  $reverseColor?: boolean;
  $height?: number | string;
  $align?: "left" | "center" | "right";
  $shortWidth?: number | string;
};

const Divider = forwardRef<HTMLDivElement, DividerProps>((props, ref) => {
  const align = props.children ? props.$align || "center" : undefined;
  const colorClassName = `bgc-${props.$color || "border"}${props.$reverseColor ? "_r" : ""}`;

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      <div
        className={`${Style.border} ${colorClassName}`}
        style={{
          height: convertSizeNumToStr(props.$height),
          width: align === "left" ? convertSizeNumToStr(props.$shortWidth) : undefined,
        }}
        data-short={align === "left"}
      />
      {props.children &&
        <>
          <div className={Style.children}>
            <Text className={Style.text}>{props.children}</Text>
          </div>
          <div
            className={`${Style.border} ${colorClassName}`}
            style={{
              height: convertSizeNumToStr(props.$height),
              width: align === "right" ? convertSizeNumToStr(props.$shortWidth) : undefined,
            }}
            data-short={align === "right"}
          />
        </>
      }
    </div>
  );
});

export default Divider;