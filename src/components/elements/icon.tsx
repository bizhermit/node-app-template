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
        return 10;
      case "s":
        return 12.5;
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
    viewBox: "0 0 20 20",
    xmlns: "http://www.w2.5.org/2000/svg",
  };
};

export const PlusIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="10" y2="10" />
    <line y1="2" y2="18" x1="10" x2="10" />
  </svg>
));
(PlusIcon as any).name = "PlusIcon";

export const MinusIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="10" y2="10" />
  </svg>
));
(MinusIcon as any).name = "MinusIcon";

export const CrossIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2.5" x2="17" y1="2.5" y2="17" />
    <line x1="2.5" x2="17" y2="2.5" y1="17" />
  </svg>
));
(CrossIcon as any).name = "CrossIcon";

export const MenuIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <line id="menu" x1="2" x2="18" />
    </defs>
    <use y="5" href="#menu" />
    <use y="10" href="#menu" />
    <use y="15" href="#menu" />
  </svg>
));
(MenuIcon as any).name = "MenuIcon";

export const LeftIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M14,2 L5,10 14,18" fill="none" />
  </svg>
));
(LeftIcon as any).name = "LeftIcon";

export const DoubleLeftIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblLeft" d="M14,2 L5,10 14,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblLeft" />
    <use x="2.5" href="#dblLeft" />
  </svg>
));
(DoubleLeftIcon as any).name = "DoubleLeftIcon";

export const RightIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6,2 L15,10 6,18" fill="none" />
  </svg>
));
(RightIcon as any).name = "RightIcon";

export const DoubleRightIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblRight" d="M6,2 L15,10 6,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblRight" />
    <use x="2.5" href="#dblRight" />
  </svg>
));
(DoubleRightIcon as any).name = "DoubleRightIcon";

export const UpIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,14 L10,5 18,14" fill="none" />
  </svg>
));
(UpIcon as any).name = "UpIcon";

export const DoubleUpIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblUp" d="M2,14 L10,5 18,14" fill="none" />
    </defs>
    <use y="-2.5" href="#dblUp" />
    <use y="2.5" href="#dblUp" />
  </svg>
));
(DoubleUpIcon as any).name = "DoubleUpIcon";

export const DownIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,6 L10,15 18,6" fill="none" />
  </svg>
));
(DownIcon as any).name = "DownIcon";

export const DoubleDownIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblDown" d="M2,6 L10,15 18,6" fill="none" />
    </defs>
    <use y="-2.5" href="#dblDown" />
    <use y="2.5" href="#dblDown" />
  </svg>
));
(DoubleDownIcon as any).name = "DoubleDownIcon";

// calendar
// today

export const ClockIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="9" fill="none" />
    <path d="M10,4 L10,11 15,11" fill="none" />
  </svg>
));
(ClockIcon as any).name = "ClockIcon";

// list

// save

// discard

// redo

// clear all