import { FC, type HTMLAttributes } from "react";
import { attrs } from "../../utilities/attributes";
import Style from "./index.module.scss";

type IconOptions = {
  $size?: Size | number | `${number}`;
};

type IconProps = OverwriteAttrs<Omit<HTMLAttributes<SVGSVGElement>, "children">, IconOptions>;

const svgAttrs = ({
  $size,
  ...p
}: IconProps) => {
  return {
    ...(() => {
      if ($size == null) return {};
      if (typeof $size === "number") {
        return {
          width: $size,
          height: $size,
        };
      }
      if (["xs", "s", "m", "l", "xl"].includes($size)) {
        return {
          "data-size": $size,
        };
      }
      return {
        width: $size,
        height: $size,
      };
    })(),
    ...attrs(p, Style.main),
    viewBox: "0 0 20 20",
    xmlns: "http://www.w2.5.org/2000/svg",
  };
};

type IconFC = FC<IconProps>;

export const PlusIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2" x2="18" y1="10" y2="10" />
    <line y1="2" y2="18" x1="10" x2="10" />
  </svg>
);

export const MinusIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2" x2="18" y1="10" y2="10" />
  </svg>
);

export const CrossIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2.5" x2="17" y1="2.5" y2="17" />
    <line x1="2.5" x2="17" y2="2.5" y1="17" />
  </svg>
);

export const MenuIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="2" x2="18" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
  </svg>
);

export const MenuLeftIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="5" x2="18" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
    <path d="M6,6 L2,10 6,14" fill="none" />
  </svg>
);

export const MenuRightIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="2" x2="18" y1="5" y2="5" />
    <line x1="2" x2="15" y1="10" y2="10" />
    <line x1="2" x2="18" y1="15" y2="15" />
    <path d="M14,6 L18,10 14,14" fill="none" />
  </svg>
);

export const LeftIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M14,2 L5,10 14,18" fill="none" />
  </svg>
);

export const DoubleLeftIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <defs>
      <path id="dblLeft" d="M14,2 L5,10 14,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblLeft" />
    <use x="2.5" href="#dblLeft" />
  </svg>
);

export const RightIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6,2 L15,10 6,18" fill="none" />
  </svg>
);

export const DoubleRightIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <defs>
      <path id="dblRight" d="M6,2 L15,10 6,18" fill="none" />
    </defs>
    <use x="-2.5" href="#dblRight" />
    <use x="2.5" href="#dblRight" />
  </svg>
);

export const UpIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,14 L10,5 18,14" fill="none" />
  </svg>
);

export const DoubleUpIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <defs>
      <path id="dblUp" d="M2,14 L10,5 18,14" fill="none" />
    </defs>
    <use y="-2.5" href="#dblUp" />
    <use y="2.5" href="#dblUp" />
  </svg>
);

export const DownIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,6 L10,15 18,6" fill="none" />
  </svg>
);

export const DoubleDownIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <defs>
      <path id="dblDown" d="M2,6 L10,15 18,6" fill="none" />
    </defs>
    <use y="-2.5" href="#dblDown" />
    <use y="2.5" href="#dblDown" />
  </svg>
);

export const LeftRightIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M7,5 L2,10 7,15 M13,5 L18,10 13,15" fill="none" />
  </svg>
);

export const UpDownIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M5,7 L10,2 15,7 M5,13 L10,18 15,13" fill="none" />
  </svg>
);

export const CalendarIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
  </svg>
);

export const TodayIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,4H18V18H2Z M5,2V5Z M15,2V5Z M2,7H18Z" fill="none" />
    <rect x="11" y="11" width="2" height="2" strokeLinejoin="miter" />
  </svg>
);

export const ClockIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <circle cx="10" cy="10" r="9" fill="none" />
    <path d="M10,4 L10,11 15,11" fill="none" />
  </svg>
);

export const ListIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <defs>
      <line id="list" x1="2" x2="18" />
    </defs>
    <use y="4" href="#list" />
    <use y="8" href="#list" />
    <use y="12" href="#list" />
    <use y="16" href="#list" />
  </svg>
);

export const SaveIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,2H15L18,5 18,18 2,18Z M5,2v4h8v-4z M5,18l0,-7 10,0 0,7" fill="none" />
  </svg>
);

export const UndoIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M4,3l0,5 5,0M4,8l2,-2a4 4.5 45 1 1 9.3,5l-6,6" fill="none" />
  </svg>
);

export const RedoIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M16,3l0,5 -5,0M16,8l-2,-2a4 4.5 315 1 0 -9.3,5l6,6" fill="none" />
  </svg>
);

export const ClearAllIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,4h16Z M2,8h16Z M2,12h9z M2,16h9z M14,12l4,4Z M14,16l4,-4" />
  </svg>
);

export const CloudIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1z" fill="none" />
  </svg>
);

export const CloudDownloadIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 8v8M7 13l3,3 3,-3" fill="none" />
  </svg>
);

export const CloudUploadIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6.5,16a4.1 4.1 0 1 1 0 -8a3.9 3.9 -180 0 1 8,0v1a3 3.5 -90 0 1 0,7.1M10 11v6M7 12.5l3,-3 3,3" fill="none" />
  </svg>
);

export const CircleIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <circle cx="10" cy="10" r="8" fill="none" />
  </svg>
);

export const CircleFillIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <circle cx="10" cy="10" r="8" fill="fill" />
  </svg>
);

export const ReloadIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M17.5,2l0,5 -5,0M16.5,14a7.5 7.5 30 1 1 0,-8" fill="none" />
  </svg>
);

export const UnloadIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2.5,2l0,5 5,0M3.5,6a7.5 7.5 -150 1 1 0,8" fill="none" />
  </svg>
);

export const SyncIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M17,1.5l0,5 -5,0M2.5,9a7.5 7.5 -180 0 1 14,-3M3,18l0,-5 5,0M17.5,9.5a7.5 7.5 0 0 1 -14,4" fill="none" />
  </svg>
);

export const HomeIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M10,2 L19,10 16,10 16,18 12,18 12,13 8,13 8,18 4,18 4,10 1,10 10,2" fill="none" />
  </svg>
);

export const ElementIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6,6 L2,10 6,14" fill="none" />
    <path d="M14,6 L18,10 14,14" fill="none" />
    <line x1="12" x2="8" y1="5" y2="15" />
  </svg>
);

export const SmileIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <circle cx="10" cy="10" r="8.5" fill="none" />
    <circle cx="6.5" cy="8" r=".8" />
    <circle cx="13.5" cy="8" r=".8" />
    <path d="M14.2,13a5 5 30 0 1 -8,0" fill="none" />
  </svg>
);

export const ButtonIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,5H18V13H2Z" fill="none" />
    <path d="M12,10L17,15 13.8,15 15,18.2 14.5,18.4 13.5,15 11,17Z" />
  </svg>
);

export const ExLinkIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M8,3H3V17H17V12 M12,2H18V8" fill="none" />
    <line x1="18" x2="8" y1="2" y2="12" />
  </svg>
);

export const ContainerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,3H18V17H2Z M5,5H15V8H5Z M5,10H12V12H5Z M5,14H15V15H5Z" fill="none" />
  </svg>
);

export const NavContainerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,3H18V17H2Z M2,7H18 M8,7V17" fill="none" />
  </svg>
);

export const PopupIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,3H18V17H2Z" opacity=".6" fill="none" />
    <path d="M4,5H16V13L12,13L10,15L8,13H4Z" fill="none" />
  </svg>
);

export const FormIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M10,3H3V17H17V10 M16,2L8,10 8,12 10,12 18,4Z" fill="none" />
  </svg>
);

export const FormItemIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M6,8H2V16H18V10 M16,2L8,10 8,12 10,12 18,4Z" fill="none" />
  </svg>
);

export const MagnifyingGlassIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <circle cx="8" cy="8" r="7" fill="none" />
    <line x1="13" x2="18" y1="13" y2="18" />
  </svg>
);

export const TextBoxIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M7,7H2V13H7 M13,7H18V13H13 M10,5L10,15 M9,4H6M11,4H14 M9,16H6M11,16H14" fill="none" />
  </svg>
);

export const TabContainerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,3H18V17H2Z M2,7H18 M10,3V7" fill="none" />
  </svg>
);

export const SlideContainerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M4,4H16V16H4Z M1,4V16 M19,4V16" fill="none" />
  </svg>
);

export const SplitContainerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,3H18V17H2Z M10,3V17" fill="none" />
  </svg>
);

export const LoadingIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="10" x2="10" y1="1" y2="5" />
    <line x1="1" x2="5" y1="10" y2="10" opacity="0.9" />
    <line x1="3.3" x2="6.4" y1="3.3" y2="6.4" opacity="0.8" />
    <line x1="3.3" x2="6.4" y1="16.7" y2="13.6" opacity="0.7" />
    <line x1="10" x2="10" y1="19" y2="15" opacity="0.6" />
    <line x1="16.7" x2="13.6" y1="16.7" y2="13.6" opacity="0.5" />
    <line x1="19" x2="15" y1="10" y2="10" opacity="0.4" />
    <line x1="16.7" x2="13.6" y1="3.3" y2="6.4" opacity="0.3" />
  </svg>
);

export const LabelIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M2,5H14L18,10 14,15H2Z" fill="none" />
  </svg>
);

export const StepperIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <path d="M1,7H7.5L9.5,10 7.5,13H1L3,10Z" />
    <path d="M10.5,7H17L19,10 17,13H10.5L13,10Z" fill="none" />
  </svg>
);

export const VerticalDividerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="10" x2="10" y1="3" y2="17" />
  </svg>
);

export const HorizontalDividerIcon: IconFC = (p) => (
  <svg {...svgAttrs(p)}>
    <line x1="3" x2="17" y1="10" y2="10" />
  </svg>
);