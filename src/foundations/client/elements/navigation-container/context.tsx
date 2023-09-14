import { createContext, useContext } from "react";

const defaultKey = "default";

export type NavigationPosition = "left" | "right" | "top" | "bottom";

export type NavigationMode = "auto" | "visible" | "minimize" | "manual" | "none";

export type NavigationHeaderVisible = "always" | "none";
export type NavigationFooterVisible = "always" | "end" | "none";

type NavigationContextProps = {
  toggle: (open?: boolean) => void;
  showed: boolean;
  position: NavigationPosition;
  setPosition: (position: NavigationPosition | typeof defaultKey) => void;
  mode: NavigationMode;
  setMode: (mode: NavigationMode | typeof defaultKey) => void;
  state: Omit<NavigationMode, "auto">;
  headerVisible: NavigationHeaderVisible;
  setHeaderVisible: (mode: NavigationHeaderVisible | typeof defaultKey) => void;
  footerVisible: NavigationFooterVisible;
  setFooterVisible: (mode: NavigationFooterVisible | typeof defaultKey) => void;
}

export const NavigationContext = createContext<NavigationContextProps>({
  toggle: () => { },
  showed: false,
  position: "left",
  setPosition: () => { },
  mode: "none",
  setMode: () => { },
  state: "none",
  headerVisible: "none",
  setHeaderVisible: () => { },
  footerVisible: "none",
  setFooterVisible: () => { },
});

export const useNavigation = () => {
  return useContext(NavigationContext);
};
