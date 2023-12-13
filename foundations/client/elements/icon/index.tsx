import { forwardRef, type CSSProperties, type ForwardedRef, type HTMLAttributes } from "react";
import { joinClassNames } from "../../utilities/attributes";
import Style from "./index.module.scss";

type IconProps = Omit<HTMLAttributes<SVGSVGElement>, "children"> & {
  className?: string;
  style?: CSSProperties;
  $size?: Size | number | `${number}`;
};

const svgAttrs = (props: IconProps) => {
  return {
    ...(() => {
      if (props.$size == null) return {};
      if (typeof props.$size === "number") {
        return {
          width: props.$size,
          height: props.$size,
        };
      }
      if (["xs", "s", "m", "l", "xl"].includes(props.$size)) {
        return {
          "data-size": props.$size,
        };
      }
      return {
        width: props.$size,
        height: props.$size,
      };
    })(),
    className: joinClassNames("icon", Style.main, props.className),
    style: props.style,
    viewBox: "0 0 20 20",
    xmlns: "http://www.w2.5.org/2000/svg",
  };
};

const svg = (
  name: string,
  component: (props: IconProps, ref: ForwardedRef<SVGSVGElement>) => JSX.Element
) => {
  const ret = forwardRef<SVGSVGElement, IconProps>(component);
  (ret as any).name = name;
  return ret;
};

export const PlusIcon = svg("PlusIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="10" y2="10" />
    <line y1="2" y2="18" x1="10" x2="10" />
  </svg>
));

export const MinusIcon = svg("MinusIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="10" y2="10" />
  </svg>
));

export const CrossIcon = svg("CrossIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2.5" x2="17" y1="2.5" y2="17" />
    <line x1="2.5" x2="17" y2="2.5" y1="17" />
  </svg>
));

export const MenuIcon = svg("MenuIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="2" x2="18" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
  </svg>
));

export const MenuLeftIcon = svg("MenuLeftIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="5" x2="18" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
    <path d="M6,6 L2,10 6,14" fill="none" />
  </svg>
));

export const MenuRightIcon = svg("MenuRightIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="2" x2="15" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
    <path d="M14,6 L18,10 14,14" fill="none" />
  </svg>
));

export const LeftIcon = svg("LeftIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M14,2 L5,10 14,18" fill="none" />
  </svg>
));

export const DoubleLeftIcon = svg("DoubleLeftIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblLeft" d="M14,2 L5,10 14,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblLeft" />
    <use x="2.5" href="#dblLeft" />
  </svg>
));

export const RightIcon = svg("RightIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6,2 L15,10 6,18" fill="none" />
  </svg>
));

export const DoubleRightIcon = svg("DoubleRightIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblRight" d="M6,2 L15,10 6,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblRight" />
    <use x="2.5" href="#dblRight" />
  </svg>
));

export const UpIcon = svg("UpIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,14 L10,5 18,14" fill="none" />
  </svg>
));

export const DoubleUpIcon = svg("DoubleUpIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblUp" d="M2,14 L10,5 18,14" fill="none" />
    </defs>
    <use y="-2.5" href="#dblUp" />
    <use y="2.5" href="#dblUp" />
  </svg>
));

export const DownIcon = svg("DownIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,6 L10,15 18,6" fill="none" />
  </svg>
));

export const DoubleDownIcon = svg("DoubleDownIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <defs>
      <path id="dblDown" d="M2,6 L10,15 18,6" fill="none" />
    </defs>
    <use y="-2.5" href="#dblDown" />
    <use y="2.5" href="#dblDown" />
  </svg>
));

export const LeftRightIcon = svg("LeftRightIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M7,5 L2,10 7,15" fill="none" />
    <path d="M13,5 L18,10 13,15" fill="none" />
    <line x1="2" x2="18" y1="10" y2="10" />
  </svg>
));

export const CalendarIcon = svg("CalendarIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
  </svg>
));

export const TodayIcon = svg("TodayIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
    <rect x="11" y="11" width="2" height="2" strokeLinejoin="miter" />
  </svg>
));

export const ClockIcon = svg("ClockIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="9" fill="none" />
    <path d="M10,4 L10,11 15,11" fill="none" />
  </svg>
));

export const ListIcon = svg("ListIcon", (props, ref) => (
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

export const SaveIcon = svg("SaveIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,2H15L18,5 18,18 2,18Z M5,2v4h8v-4z M5,18l0,-7 10,0 0,7" fill="none" />
  </svg>
));

export const UndoIcon = svg("UndoIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M4,3l0,5 5,0M4,8l2,-2a4 4.5 45 1 1 9.3,5l-6,6" fill="none" />
  </svg>
));

export const RedoIcon = svg("RedoIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M16,3l0,5 -5,0M16,8l-2,-2a4 4.5 315 1 0 -9.3,5l6,6" fill="none" />
  </svg>
));

export const ClearAllIcon = svg("ClearAllIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2,4h16Z M2,8h16Z M2,12h9z M2,16h9z M14,12l4,4Z M14,16l4,-4" />
  </svg>
));

export const CloudIcon = svg("CloudIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1z" fill="none" />
  </svg>
));

export const CloudDownloadIcon = svg("CloudDownloadIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 8v8M7 13l3,3 3,-3" fill="none" />
  </svg>
));

export const CloudUploadIcon = svg("CloudUploadIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 11v6M7 12.5l3,-3 3,3" fill="none" />
  </svg>
));

export const CircleIcon = svg("CircleIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="8" fill="none" />
  </svg>
));

export const CircleFillIcon = svg("CircleFillIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="8" fill="fill" />
  </svg>
));

export const ReloadIcon = svg("ReloadIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M17.5,2l0,5 -5,0M16.5,14a7.5 7.5 30 1 1 0,-8" fill="none" />
  </svg>
));

export const UnloadIcon = svg("UnloadIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M2.5,2l0,5 5,0M3.5,6a7.5 7.5 -150 1 1 0,8" fill="none" />
  </svg>
));

export const SyncIcon = svg("SyncIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M17,1.5l0,5 -5,0M2.5,9a7.5 7.5 -180 0 1 14,-3M3,18l0,-5 5,0M17.5,9.5a7.5 7.5 0 0 1 -14,4" fill="none" />
  </svg>
));

export const HomeIcon = svg("HomeIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M10,2 L19,10 16,10 16,18 12,18 12,13 8,13 8,18 4,18 4,10 1,10 10,2" fill="none" />
  </svg>
));

export const ElementIcon = svg("ElementIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <path d="M6,6 L2,10 6,14" fill="none" />
    <path d="M14,6 L18,10 14,14" fill="none" />
    <line x1="12" x2="8" y1="5" y2="15" />
  </svg>
));

export const SmileIcon = svg("SmileIcon", (props, ref) => (
  <svg {...svgAttrs(props)} ref={ref}>
    <circle cx="10" cy="10" r="8.5" fill="none" />
    <circle cx="6.5" cy="8" r=".8" />
    <circle cx="13.5" cy="8" r=".8" />
    <path d="M 14.2,13 a 5 5 30 0 1 -8,0" fill="none" />
  </svg>
));