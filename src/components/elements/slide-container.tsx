import React, { FC, HTMLAttributes, ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import Style from "$/components/elements/slide-container.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";
import LabelText from "@/components/elements/label-text";

type SlideState = "before" | "previous" | "current" | "next" | "after";
export type SlideDirection = "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";

export type SlideContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $direction?: SlideDirection;
  $index: number;
  $onChange?: (index: number) => void;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $bodyColor?: Color;
  $overlap?: boolean;
  $breadcrumbs?: boolean
  $breadcrumbsPosition?: "top" | "left" | "bottom" | "right";
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const SlideContainer = React.forwardRef<HTMLDivElement, SlideContainerProps>((props, ref) => {
  const bodyColor = props.$bodyColor || "base";

  const { breadcrumbs, bodys } = (() => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const breadcrumbs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    const current = props.$index ?? 0;
    for (let i = 0, il = children.length; i < il; i++) {
      const child = children[i]!;
      const overlap = child.props?.overlap ?? props.$overlap ?? false;
      if (props.$breadcrumbs) {
        breadcrumbs.push(
          <div
            key={i}
            className={Style.breadcrumb}
            data-visible={i <= current}
          >
            <LabelText>{child?.props.label}</LabelText>
          </div>
        );
      }
      bodys.push(
        <Content
          key={i}
          color={bodyColor}
          overlap={overlap}
          defaultMount={props.$defaultMount ?? false}
          unmountDeselected={props.$unmountDeselected ?? true}
          index={i}
          current={current}
        >
          {child}
        </Content>
      );
    }
    return { breadcrumbs, bodys };
  })();

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-direction={props.$direction || "horizontal"}
      data-pos={props.$breadcrumbsPosition || "top"}
    >
      {props.$breadcrumbs &&
        <div className={Style.breadcrumbs}>
          {breadcrumbs}
        </div>
      }
      <div className={`${Style.body} c-${bodyColor}`}>
        {bodys}
      </div>
    </div>
  );
});

const calcState = (index: number, current: number): SlideState => {
  if (index === current) return "current";
  if (index === current - 1) return "previous";
  if (index === current + 1) return "next";
  if (index < current) return "before";
  return "after";
};

const Content: FC<{
  index: number;
  current: number;
  defaultMount: boolean;
  unmountDeselected: boolean;
  color: Color;
  overlap: boolean;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<SlideState>(calcState(props.index, props.current));
  const [mounted, setMounted] = useState(state === "current" || props.defaultMount);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    const state = e.currentTarget.getAttribute("data-state") as SlideState;
    if (state !== "current") {
      e.currentTarget.style.visibility = "hidden";
      e.currentTarget.style.opacity = "0";
      if (props.unmountDeselected) {
        setMounted(false);
      }
    }
  };

  useEffect(() => {
    const newState = calcState(props.index, props.current);
    if (newState === "current") {
      setMounted(true);
      ref.current?.style.removeProperty("opacity");
      ref.current?.style.removeProperty("visibility");
    }
    setState(newState);
  }, [props.current]);

  return (
    <div
      ref={ref}
      className={`${Style.content} c-${props.color}`}
      data-state={state}
      data-overlap={props.overlap}
      onTransitionEnd={transitionEnd}
    >
      {mounted && props.children}
    </div>
  );
};

export const SlideContent: FC<{
  label?: ReactNode;
  labelClick?: VoidFunc;
  overlap?: boolean;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SlideContainer;