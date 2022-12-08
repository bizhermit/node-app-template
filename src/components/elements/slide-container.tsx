import React, { FC, HTMLAttributes, ReactElement, ReactNode } from "react"
import Style from "$/components/elements/slide-container.module.scss";
import { attributesWithoutChildren } from "@/utilities/attributes";

export type SlideContainerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  $destination?: "right" | "bottom" | "top" | "left";
  $index: number;
  $onChange?: (index: number) => void;
  $defaultMount?: boolean;
  $unmountDeselected?: boolean;
  $bodyColor?: Color;
  children?: ReactElement | [ReactElement, ...Array<ReactElement>];
};

const SlideContainer = React.forwardRef<HTMLDivElement, SlideContainerProps>((props, ref) => {
  const bodyColor = props.$bodyColor || "base";

  return (
    <div
      {...attributesWithoutChildren(props, Style.wrap)}
      ref={ref}
      data-dest={props.$destination}
    >
      <div className={Style.header}></div>
      <div className={`${Style.body} c-${bodyColor}`}>
        {/* {bodys} */}
      </div>
    </div>
  );
});

const Content: FC<{
  index: number;
  current: number;
  color: Color;
  children: ReactNode;
}> = (props) => {
  return (
    <div
      className={`${Style.content} c-${props.color}`}
    >

    </div>
  );
};

export const SlideContent: FC<{
  label?: ReactNode;
  labelClick?: VoidFunc;
  children?: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export default SlideContainer;