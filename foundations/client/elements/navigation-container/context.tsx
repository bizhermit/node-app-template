import { createContext, useContext, type ElementType, type HTMLAttributes, type ReactNode } from "react";

export type NavigationPosition = "left" | "right";

export type NavigationMode = "auto" | "visible" | "minimize" | "manual";

export type NavigationHeaderMode = "fill" | "sticky" | "scroll";

type NavigationContextProps = {
  position: NavigationPosition;
  setPosition: (pos: NavigationPosition) => void;
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  headerMode: NavigationHeaderMode;
  setHeaderMode: (mode: NavigationHeaderMode) => void;
  toggle: () => void;
  resetRadio: () => void;
  closeMenu: () => void;
  getHeaderSizeNum: () => number;
  scrollIntoView: (element: HTMLElement | null | undefined, arg?: boolean | ScrollIntoViewOptions) => void;
  scrollNavIntoView: (element: HTMLElement | null | undefined, arg?: boolean | ScrollIntoViewOptions) => void;
}

export const NavigationContext = createContext<NavigationContextProps>({
  position: "left",
  setPosition: () => { },
  mode: "auto",
  setMode: () => { },
  headerMode: "fill",
  setHeaderMode: () => { },
  toggle: () => { },
  resetRadio: () => { },
  closeMenu: () => { },
  getHeaderSizeNum: () => 0,
  scrollIntoView: () => { },
  scrollNavIntoView: () => { },
});

export const useNavigation = () => {
  return useContext(NavigationContext);
};

type OmitAttributes = "color" | "children";
export type NavigationContainerProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $name?: string;
  $defaultNavPosition?: NavigationPosition;
  $navPosition?: NavigationPosition;
  $defaultNavMode?: NavigationMode;
  $navMode?: NavigationMode;
  $headerMode?: NavigationHeaderMode;
  $defaultHeaderMode?: NavigationHeaderMode;
  $headerTag?: ElementType;
  $footerTag?: ElementType;
  $navTag?: ElementType;
  $mainTag?: ElementType;
  $header?: ReactNode;
  $footer?: ReactNode;
  $nav?: ReactNode;
  $navTitle?: ReactNode;
  children: ReactNode;
};
