import { joinClassNames } from "@/components/utilities/attributes";
import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";

type IconProps = Omit<HTMLAttributes<SVGSVGElement>, "children"> & {
  className?: string;
  style?: CSSProperties;
  $size?: Size | number;
};

const svgAttrs = (props: IconProps) => {
  const size = (() => {
    if (props.$size == null) return 0;
    if (typeof props.$size === "number") return props.$size;
    switch (props.$size) {
      case "xs":
        return 8;
      case "s":
        return 12;
      case "l":
        return 20;
      case "xl":
        return 24;
      default:
        return 16;
    }
  })();
  return {
    height: size,
    width: size,
    className: joinClassNames("icon", props.className),
    style: props.style,
    viewBox: "viewBox 0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg",
  };
};

export const PlusIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="10%" x2="90%" y1="50%" y2="50%" />
    <line y1="10%" y2="90%" x1="50%" x2="50%" />
  </svg>
));
(PlusIcon as any).name = "PlusIcon";

export const MinusIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="10%" x2="90%" y1="50%" y2="50%" />
  </svg>
));
(MinusIcon as any).name = "MinusIcon";

export const CrossIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="15%" x2="85%" y1="15%" y2="85%" />
    <line x1="15%" x2="85%" y2="15%" y1="85%" />
  </svg>
));
(CrossIcon as any).name = "CrossIcon";

export const MenuIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <line id="menu" x1="10%" x2="90%" />
    </defs>
    <use y="25%" href="#menu" />
    <use y="50%" href="#menu" />
    <use y="75%" href="#menu" />
  </svg>
));
(MenuIcon as any).name = "MenuIcon";

export const LeftIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="70%" x2="30%" y1="15%" y2="50%" />
    <line x2="70%" x1="30%" y2="85%" y1="50%" />
  </svg>
));
(LeftIcon as any).name = "LeftIcon";

export const DoubleLeftIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <g id="dblLeft">
        <line x1="70%" x2="30%" y1="15%" y2="50%" />
        <line x2="70%" x1="30%" y2="85%" y1="50%" />
      </g>
    </defs>
    <use x="-12%" href="#dblLeft" />
    <use x="12%" href="#dblLeft" />
  </svg>
));
(DoubleLeftIcon as any).name = "DoubleLeftIcon";

export const RightIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="30%" x2="70%" y1="15%" y2="50%" />
    <line x2="30%" x1="70%" y2="85%" y1="50%" />
  </svg>
));
(RightIcon as any).name = "RightIcon";

export const DoubleRightIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <g id="dblRight">
        <line x1="30%" x2="70%" y1="15%" y2="50%" />
        <line x2="30%" x1="70%" y2="85%" y1="50%" />
      </g>
    </defs>
    <use x="-12%" href="#dblRight" />
    <use x="12%" href="#dblRight" />
  </svg>
));
(DoubleRightIcon as any).name = "DoubleRightIcon";

export const UpIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line y1="30%" y2="70%" x1="50%" x2="15%" />
    <line y2="30%" y1="70%" x2="50%" x1="85%" />
  </svg>
));
(UpIcon as any).name = "UpIcon";

export const DoubleUpIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <g id="dblUp">
        <line y1="30%" y2="70%" x1="50%" x2="15%" />
        <line y2="30%" y1="70%" x2="50%" x1="85%" />
      </g>
    </defs>
    <use y="-12%" href="#dblUp" />
    <use y="12%" href="#dblUp" />
  </svg>
));
(DoubleUpIcon as any).name = "DoubleUpIcon";

export const DownIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line y1="70%" y2="30%" x1="50%" x2="15%" />
    <line y2="70%" y1="30%" x2="50%" x1="85%" />
  </svg>
));
(DownIcon as any).name = "DownIcon";

export const DoubleDownIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <g id="dblDown">
        <line y1="70%" y2="30%" x1="50%" x2="15%" />
        <line y2="70%" y1="30%" x2="50%" x1="85%" />
      </g>
    </defs>
    <use y="-12%" href="#dblDown" />
    <use y="12%" href="#dblDown" />
  </svg>
));
(DoubleDownIcon as any).name = "DoubleDownIcon";