import { createContext, useContext } from "react";

export const WindowSize = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
};
export type WindowSizeValue = typeof WindowSize[keyof typeof WindowSize];

type LayoutContextProps = {
  windowSize: WindowSizeValue;
  mobile: boolean;
};

export const LayoutContext = createContext<LayoutContextProps>({
  windowSize: WindowSize.m,
  mobile: false,
});

const useLayout = () => {
  return useContext(LayoutContext);
};

export default useLayout;