import { type FC, forwardRef, type HTMLAttributes, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import Style from "$/components/elements/slide-container.module.scss";
import { attributesWithoutChildren } from "@/components/utilities/attributes";
import LabelText from "@/components/elements/label-text";

type SlideState = "before" | "previous" | "current" | "next" | "after";
export type SlideDirection = "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";

type OmitAttributes = "color" | "children";
export type SlideContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $direction?: SlideDirection;
  $index: number;
  $onChange?: (index: number) => void;
  $defaultMount?: boolean;
  $preventUnmountDeselected?: boolean;
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

const SlideContainer = forwardRef<HTMLDivElement, SlideContainerProps>((props, ref) => {
  const bodyColor = props.$bodyColor || "base";

  const { breadcrumbs, bodys } = (() => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const breadcrumbs: Array<ReactNode> = [];
    const bodys: Array<ReactNode> = [];
    const current = props.$index ?? 0;
    for (let i = 0, il = children.length; i < il; i++) {
      const state = calcState(i, current);
      const child = children[i]!;
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
          current={props.$index}
          color={bodyColor}
          overlap={child.props?.overlap ?? props.$overlap ?? false}
          defaultMount={child.props.defaultMount ?? props.$defaultMount ?? false}
          preventUnmountDeselected={child.props.preventUnmountDeselected ?? props.$preventUnmountDeselected ?? false}
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
    if (e.target !== e.currentTarget) return;
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
      style={{
        width: 0,
        height: 0,
        visibility: "hidden",
        opacity: 0,
        padding: 0,
      }}
      data-state={state}
      onTransitionEnd={transitionEnd}
    >
      <LabelText>{props.children}</LabelText>
    </div>
  );
};

const Content: FC<{
  current: number;
  state: SlideState;
  defaultMount: boolean;
  preventUnmountDeselected: boolean;
  color: Color;
  overlap: boolean;
  children: ReactNode;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [state, setState] = useState<SlideState>(props.state);
  const [mounted, setMounted] = useState(state === "current" || props.defaultMount);

  const transitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const state = e.currentTarget.getAttribute("data-state") as SlideState;
    if (state !== "current") {
      e.currentTarget.style.visibility = "hidden";
      if (props.preventUnmountDeselected) return;
      setMounted(false);
    }
  };

  useEffect(() => {
    if (props.state === "current") {
      setMounted(true);
      ref.current?.style.removeProperty("visibility");
    }
    setState(props.state);
  }, [props.state, props.current]);

  return (
    <div
      ref={ref}
      className={`${Style.content} c-${props.color}`}
      style={{
        visibility: "hidden",
      }}
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
  overlap?: boolean;
  defaultMount?: boolean;
  preventUnmountDeselected?: boolean;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SlideContainer;