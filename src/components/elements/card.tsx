import React, { HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Style from "$/components/elements/card.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";
import useToggleAnimation from "@/hooks/toggle-animation";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import LabelText from "@/pages/sandbox/elements/label-text";

type ReactNodeArray = Array<ReactNode>;
type IconPosition = "start" | "end" | "both" | "none";
export type CardProps = HTMLAttributes<HTMLDivElement> & {
  $color?: Color;
  $headerAlign?: "start" | "center" | "end";
  $footerAlign?: "start" | "center" | "end";
  $accordion?: boolean;
  $disabled?: boolean;
  $openedIcon?: ReactNode;
  $closedIcon?: ReactNode;
  $iconPosition?: IconPosition | {
    header?: IconPosition;
    footer?: IconPosition;
  };
  $direction?: "vertical" | "horizontal";
  $defaultOpened?: boolean;
  $opened?: boolean;
  $preventDefaultMounted?: boolean;
  $toggleTriger?: "header" | "footer" | "h&f";
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
    open: opened || !props.$accordion,
    direction: props.$direction || "vertical",
    onToggled: props.$onToggled
  });

  const childCtx = (() => {
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
  })();

  const toggleTriger = (() => {
    if (props.$accordion == null || props.$disabled) return { header: false, footer: false };
    if (props.$toggleTriger === "h&f") return { header: true, footer: true };
    if (props.$toggleTriger === "footer") return { header: false, footer: true };
    return { header: true, footer: false };
  })();

  const iconNode = (
    <div className={Style.icon}>
      {opened ?
        props.$openedIcon ?? <VscChromeMinimize /> :
        props.$closedIcon ?? <VscAdd />
      }
    </div>
  );

  const iconPosCtx: { header: IconPosition; footer: IconPosition; } = (() => {
    if (!props.$accordion) return { header: "none", footer: "none" };
    if (props.$iconPosition == null) return { header: "start", footer: "start" };
    if (typeof props.$iconPosition === "string") return { header: props.$iconPosition, footer: props.$iconPosition };
    return {
      header: props.$iconPosition.header || "start",
      footer: props.$iconPosition.footer || "start",
    };
  })();

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-direction={props.$direction || "vertical"}
    >
      {childCtx.header != null &&
        <div
          className={`${Style.header} c-${props.$color}`}
          data-accordion={toggleTriger.header}
          data-icon={toggleTriger.header ? iconPosCtx.header : "none"}
          onClick={toggleTriger.header ? toggle : undefined}
        >
          {toggleTriger.header && (iconPosCtx.header === "start" || iconPosCtx.header === "both") && iconNode}
          <div
            className={Style.content}
            data-align={props.$headerAlign || "start"}
          >
            <LabelText className={Style.text}>
              {(props.children as ReactNodeArray)[childCtx.header]}
            </LabelText>
          </div>
          {toggleTriger.header && (iconPosCtx.header === "end" || iconPosCtx.header === "both") && iconNode}
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
        <div
          className={`${Style.footer} c-${props.$color}`}
          data-accordion={toggleTriger.footer}
          data-icon={toggleTriger.footer ? iconPosCtx.footer : "none"}
          onClick={toggleTriger.footer ? toggle : undefined}
        >
          {toggleTriger.footer && (iconPosCtx.footer === "start" || iconPosCtx.footer === "both") && iconNode}
          <div
            className={Style.content}
            data-align={props.$footerAlign || "start"}
          >
            <LabelText className={Style.text}>
              {(props.children as ReactNodeArray)[childCtx.footer]}
            </LabelText>
          </div>
          {toggleTriger.footer && (iconPosCtx.footer === "end" || iconPosCtx.footer === "both") && iconNode}
        </div>
      }
    </div>
  );
});

export default Card;