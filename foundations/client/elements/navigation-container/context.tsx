import { createContext, useContext } from "react";

export type NavigationPosition = "left" | "right";

export type NavigationMode = "auto" | "visible" | "minimize" | "manual";

type NavigationContextProps = {
  navPos: NavigationPosition;
  setNavPos: (pos: NavigationPosition) => void;
  navMode: NavigationMode;
  setNavMode: (mode: NavigationMode) => void;
  toggle: () => void;
  resetRadio: () => void;
  closeMenu: () => void;
}

export const NavigationContext = createContext<NavigationContextProps>({
  navPos: "left",
  setNavPos: () => { },
  navMode: "auto",
  setNavMode: () => { },
  toggle: () => { },
  resetRadio: () => { },
  closeMenu: () => { },
});

export const useNavigation = () => {
  return useContext(NavigationContext);
};
