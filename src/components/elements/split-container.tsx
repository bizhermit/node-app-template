import { attributesWithoutChildren, convertSizeNumToStr } from "@/components/utilities/attributes";
import React, { FC, HTMLAttributes, ReactElement, ReactNode, useEffect, useImperativeHandle, useRef } from "react";
import Style from "$/components/elements/split-container.module.scss";
import Resizer from "./resizer";

export type SplitDirection = "horizontal" | "vertical";

export type SplitContainerProps = HTMLAttributes<HTMLDivElement> & {
  $direction?: SplitDirection;
  $reverse?: boolean;
  $disabled?: boolean;
  $hide1?: boolean;
  $hide2?: boolean;
  children: [ReactElement, ReactElement];
};

const SplitContainer = React.forwardRef<HTMLDivElement, SplitContainerProps>((props, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);
  const child1Ref = useRef<HTMLDivElement>(null!);

  const direction = props.$direction || "horizontal";
  const reverse = props.$reverse ?? false;
  const child0 = props.children[0];
  const child1 = props.children[1];
  const show1 = !props.$hide1;
  const show2 = !props.$hide2;

  useEffect(() => {
    const defaultSize = child1.props.defaultSize;
    const maxSize = child1.props.maxSize;
    const minSize = child1.props.minSize;
    if (child1Ref.current) {
      if (direction === "horizontal") {
        child1Ref.current.style.removeProperty("height");
        child1Ref.current.style.removeProperty("max-height");
        child1Ref.current.style.removeProperty("min-height");
        child1Ref.current.style.width = convertSizeNumToStr(defaultSize) ?? "50%";
        if (maxSize != null) {
          child1Ref.current.style.maxWidth = convertSizeNumToStr(maxSize)!;
        }
        if (minSize != null) {
          child1Ref.current.style.minWidth = convertSizeNumToStr(minSize)!;
        }
      } else {
        child1Ref.current.style.removeProperty("width");
        child1Ref.current.style.removeProperty("max-width");
        child1Ref.current.style.removeProperty("min-width");
        child1Ref.current.style.height = convertSizeNumToStr(defaultSize) ?? "50%";
        if (maxSize != null) {
          child1Ref.current.style.maxHeight = convertSizeNumToStr(maxSize)!;
        }
        if (minSize != null) {
          child1Ref.current.style.minHeight = convertSizeNumToStr(minSize)!;
        }
      }
    }
  }, [direction, show1, show2]);

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-direction={direction}
      data-reverse={reverse}
    >
      {show1 &&
        <div className={Style.content0}>
          {child0}
        </div>
      }
      {!props.$disabled && show1 && show2 &&
        <Resizer
          className={Style.handle}
          targetRef={child1Ref}
          direction={direction === "horizontal" ? "x" : "y"}
          reverse={!reverse}
        />
      }
      {show2 &&
        <div
          className={Style.content1}
          ref={child1Ref}
        >
          {child1}
        </div>
      }
    </div>
  );
});

export const SplitContent: FC<{
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SplitContainer;