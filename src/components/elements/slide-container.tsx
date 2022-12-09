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

const calcState = (index: number, current: number): SlideState => {
  if (index === current) return "current";
  if (index === current - 1) return "previous";
  if (index === current + 1) return "next";
  if (index < current) return "before";
  return "after";
};

const SlideContainer = React.forwardRef<HTMLDivElement, SlideContainerProps>((props, ref) => {
  const bodyColor = props.$bodyColor || "base";

  const { breadcrumbs, bodys } = (() => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const breadcrumbs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    const current = props.$index ?? 0;
    for (let i = 0, il = children.length; i < il; i++) {
      const state = calcState(i, current);
      const child = children[i]!;
      const overlap = child.props?.overlap ?? props.$overlap ?? false;
      if (props.$breadcrumbs) {
        breadcrumbs.push(
          <Breadcrumb
            key={i}
            state={state}
          >
            {child?.props.label}
          </Breadcrumb>
        );
      }
      bodys.push(
        <Content
          key={i}
          color={bodyColor}
          overlap={overlap}
          defaultMount={props.$defaultMount ?? false}
          unmountDeselected={props.$unmountDeselected ?? true}
          state={state}
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

const Breadcrumb: FC<{
  state: SlideState;
  children?: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<SlideState>(props.state);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    const state = e.currentTarget.getAttribute("data-state") as SlideState;
    if (state === "next" || state === "after") {
      e.currentTarget.style.visibility = "hidden";
      e.currentTarget.style.opacity = "0";
      e.currentTarget.style.width = "0";
      e.currentTarget.style.height = "0";
      e.currentTarget.style.padding = "0";
    }
  };

  useEffect(() => {
    if (props.state === "current" || props.state === "before" || props.state === "previous") {
      ref.current?.style.removeProperty("opacity");
      ref.current?.style.removeProperty("visibility");
      ref.current?.style.removeProperty("width");
      ref.current?.style.removeProperty("height");
      ref.current?.style.removeProperty("padding");
    }
    setState(props.state);
  }, [props.state]);

  return (
    <div
      ref={ref}
      className={Style.breadcrumb}
      data-state={state}
      onTransitionEnd={transitionEnd}
      style={{ width: 0, height: 0, visibility: "hidden", opacity: 0, padding: 0 }}
    >
      <LabelText>{props.children}</LabelText>
    </div>
  );
};

const Content: FC<{
  state: SlideState;
  defaultMount: boolean;
  unmountDeselected: boolean;
  color: Color;
  overlap: boolean;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<SlideState>(props.state);
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
    if (props.state === "current") {
      setMounted(true);
      ref.current?.style.removeProperty("opacity");
      ref.current?.style.removeProperty("visibility");
    }
    setState(props.state);
  }, [props.state]);

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