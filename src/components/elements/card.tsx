import React, { HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/card.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";
import useToggleAnimation from "@/hooks/toggle-animation";

type ReactNodeArray = Array<ReactNode>;
export type CardProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $accordion?: boolean;
  $accordionDirection?: "vertical" | "horizontal";
  $defaultOpened?: boolean;
  $opened?: boolean;
  $preventDefaultMounted?: boolean;
  $onToggle?: (open: boolean) => void;
  $onToggled?: (open: boolean) => void;
  children?: ReactNode | [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
};

const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const bref = useRef<HTMLDivElement>(null!);
  const [opened, setOpened] = useState(props.$accordion ? (props.$opened ?? props.$defaultOpened ?? true) : true);
  const mounted = useRef(props.$accordion ? (props.$preventDefaultMounted ?? true) : true);

  const toggle = () => {
    if (!props.$accordion) return;
    mounted.current = true;
    if (props.$opened == null) {
      setOpened(c => !c);
      props.$onToggle?.(!opened);
      return;
    }
    props.$onToggle?.(!opened);
  };

  useEffect(() => {
    if (!props.$accordion) return;
    if (props.$opened != null) {
      if (props.$opened) mounted.current = true;
      setOpened(props.$opened);
    }
  }, [props.$opened]);

  useToggleAnimation({
    elementRef: bref,
    open: opened,
    direction: props.$accordionDirection || "vertical",
  });

  const childCtx = useMemo(() => {
    if (!Array.isArray(props.children)) {
      return { body: -1 };
    }
    const hasHeader = props.children.length >= 2;
    const hasFooter = props.children.length >= 3;
    return {
      header: hasHeader ? 0 : undefined,
      body: hasHeader ? 1 : 0,
      footer: hasFooter ? 2 : undefined,
    };
  }, []);

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
    >
      {childCtx.header != null &&
        <div className={Style.header}>
          {(props.children as ReactNodeArray)[childCtx.header]}
        </div>
      }
      <div
        className={Style.body}
        ref={bref}
      >
        {childCtx.body === -1 ?
          props.children :
          (props.children as ReactNodeArray)[childCtx.body]
        }
      </div>
      {childCtx.footer != null &&
        <div className={Style.footer}>
          {(props.children as ReactNodeArray)[childCtx.footer]}
        </div>
      }
    </div>
  );
});

export default Card;