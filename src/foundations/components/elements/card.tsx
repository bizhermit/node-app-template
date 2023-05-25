import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useRef, useState, useReducer } from "react";
import Style from "$/components/elements/card.module.scss";
import { attributesWithoutChildren } from "#/components/utilities/attributes";
import useToggleAnimation from "#/hooks/toggle-animation";
import Text from "#/components/elements/text";
import Resizer from "#/components/elements/resizer";
import { MinusIcon, PlusIcon } from "#/components/elements/icon";

type ReactNodeArray = Array<ReactNode>;
type IconPosition = "start" | "end" | "both" | "none";
type OmitAttributes = "color" | "children";
export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
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
  $defaultMount?: boolean;
  $unmountBody?: boolean;
  $toggleTriger?: "header" | "footer" | "h&f";
  $onToggle?: (open: boolean) => void;
  $onToggled?: (open: boolean) => void;
  $resize?: boolean | "x" | "y" | "xy";
  children?: ReactNode | [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
};

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const bref = useRef<HTMLDivElement>(null!);
  const [opened, setOpened] = useState(props.$accordion ? (props.$opened ?? props.$defaultOpened ?? true) : true);
  const mounted = useRef(props.$accordion ? (opened ? true : (props.$defaultMount ?? false)) : true);
  const [mount, setMount] = useReducer((_: boolean, action: boolean) => {
    return mounted.current = action;
  }, mounted.current);

  const toggle = () => {
    if (!props.$accordion) return;
    mounted.current = true;
    if (props.$opened == null) {
      setOpened(c => !c);
      setMount(true);
      props.$onToggle?.(!opened);
      return;
    }
    props.$onToggle?.(!opened);
  };

  useEffect(() => {
    if (!props.$accordion) return;
    if (props.$opened == null) return;
    if (props.$opened) setMount(true);
    setOpened(props.$opened);
  }, [props.$opened]);

  const toggleAnimationInitStyle = useToggleAnimation({
    elementRef: bref,
    open: opened || !props.$accordion,
    direction: props.$direction || "vertical",
    onToggled: (open) => {
      if (!open && props.$unmountBody) setMount(false);
      props.$onToggled?.(open);
    }
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
    if (!props.$accordion || props.$disabled) return { header: false, footer: false };
    if (props.$toggleTriger === "h&f") return { header: true, footer: true };
    if (props.$toggleTriger === "footer") return { header: false, footer: true };
    return { header: true, footer: false };
  })();

  const iconNode = (
    <div className={Style.icon}>
      {opened ?
        props.$openedIcon ?? <MinusIcon /> :
        props.$closedIcon ?? <PlusIcon />
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
            <Text className={Style.text}>
              {(props.children as ReactNodeArray)[childCtx.header]}
            </Text>
          </div>
          {toggleTriger.header && (iconPosCtx.header === "end" || iconPosCtx.header === "both") && iconNode}
        </div>
      }
      <div
        className={Style.body}
        style={toggleAnimationInitStyle}
        ref={bref}
      >
        {(mounted.current || opened) && mount &&
          (childCtx.body === -1 ?
            props.children :
            (props.children as ReactNodeArray)[childCtx.body]
          )
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
            <Text className={Style.text}>
              {(props.children as ReactNodeArray)[childCtx.footer]}
            </Text>
          </div>
          {toggleTriger.footer && (iconPosCtx.footer === "end" || iconPosCtx.footer === "both") && iconNode}
        </div>
      }
      {props.$resize &&
        <Resizer direction={typeof props.$resize === "boolean" ? "xy" : props.$resize} />
      }
    </div>
  );
});

export default Card;