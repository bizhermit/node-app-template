import Popup from "@/components/elements/popup";
import { attributesWithoutChildren } from "@/utilities/attributes";
import React, { HTMLAttributes, ReactNode, useCallback, useImperativeHandle, useRef, useState } from "react";

type TooltipProps = HTMLAttributes<HTMLDivElement> & {
  $disabled?: boolean;
  $showDelay?: number;
  $position?: {
    x?: "outer" | "outer-left" | "outer-right",
    y?: "outer" | "outer-top" | "outer-bottom",
  },
  $animationDuration?: number;
  children: ReactNode | [ReactNode] | [ReactNode, ReactNode];
};

type MousePosition = { pageX: number; pageY: number };

const cursorMargin = 5;

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, $ref) => {
  const ref = useRef<HTMLDivElement>(null!);
  useImperativeHandle($ref, () => ref.current);

  const [showed, setShowed] = useState(false);
  const mousePosition = useRef<MousePosition | undefined>();
  const posX = props.$position?.x || "outer";
  const posY = props.$position?.y || "outer";

  const move = useCallback((e: MouseEvent) => {
    mousePosition.current = {
      pageX: e.pageX,
      pageY: e.pageY,
    };
  }, []);

  const enter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.$disabled) return;
    mousePosition.current = {
      pageX: e.pageX,
      pageY: e.pageY,
    };
    window.addEventListener("mousemove", move);
    setTimeout(() => {
      if (mousePosition.current == null) return;
      setShowed(true);
    }, props.$showDelay ?? 500);
  };

  const leave = () => {
    window.removeEventListener("mousemove", move);
    mousePosition.current = undefined;
    setShowed(false);
  };

  return (
    <>
      <div
        {...attributesWithoutChildren(props)}
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        {Array.isArray(props.children) ? props.children[0] : props.children}
      </div>
      {Array.isArray(props.children) && props.children[1] != null &&
        <Popup
          $show={showed && mousePosition.current != null}
          $onToggle={showed => {
            if (!showed) {
              leave();
            }
          }}
          $anchor={mousePosition.current}
          $position={{
            x: posX,
            y: posY,
            marginX: cursorMargin,
            marginY: cursorMargin,
          }}
          $animationDuration={props.$animationDuration ?? 40}
        >
          {props.children[1]}
        </Popup>
      }
    </>
  );
});

export default Tooltip;