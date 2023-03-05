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
        return 14;
      case "s":
        return 18;
      case "l":
        return 26;
      case "xl":
        return 30;
      default:
        return 22;
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
    <use y="25%" xlinkHref="#menu" />
    <use y="50%" xlinkHref="#menu" />
    <use y="75%" xlinkHref="#menu" />
  </svg>
));
(MenuIcon as any).name = "MenuIcon";