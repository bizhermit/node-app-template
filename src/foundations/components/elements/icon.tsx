import { joinClassNames } from "#/components/utilities/attributes";
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

export const CalendarIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
  </svg>
));
(CalendarIcon as any).name = "CalendarIcon";

export const TodayIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
    <rect x="11" y="11" width="2" height="2" strokeLinejoin="miter" />
  </svg>
));
(TodayIcon as any).name = "TodayIcon";

export const ClockIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="9" fill="none" />
    <path d="M10,4 L10,11 15,11" fill="none" />
  </svg>
));
(ClockIcon as any).name = "ClockIcon";

export const ListIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <line id="list" x1="2" x2="18" />
    </defs>
    <use y="4" href="#list" />
    <use y="8" href="#list" />
    <use y="12" href="#list" />
    <use y="16" href="#list" />
  </svg>
));
(ListIcon as any).name = "ListIcon";

export const SaveIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,2H15L18,5 18,18 2,18Z M5,2v4h8v-4z M5,18l0,-7 10,0 0,7" fill="none" />
  </svg>
));
(SaveIcon as any).name = "SaveIcon";

export const UndoIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M4,3l0,5 5,0M4,8l2,-2a4 4.5 45 1 1 9.3,5l-6,6" fill="none" />
  </svg>
));
(UndoIcon as any).name = "UndoIcon";

export const RedoIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M16,3l0,5 -5,0M16,8l-2,-2a4 4.5 315 1 0 -9.3,5l6,6" fill="none" />
  </svg>
));
(RedoIcon as any).name = "RedoIcon";

export const ClearAllIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4h16Z M2,8h16Z M2,12h9z M2,16h9z M14,12l4,4Z M14,16l4,-4" />
  </svg>
));
(ClearAllIcon as any).name = "ClearAllIcon";

export const CloudIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1z" fill="none" />
  </svg>
));
(CloudIcon as any).name = "CloudIcon";

export const CloudDownloadIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 8v8M7 13l3,3 3,-3" fill="none" />
  </svg>
));
(CloudDownloadIcon as any).name = "CloudDownloadIcon";

export const CloudUploadIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 11v6M7 12.5l3,-3 3,3" fill="none" />
  </svg>
));
(CloudUploadIcon as any).name = "CloudUploadIcon";