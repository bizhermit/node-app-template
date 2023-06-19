import { WindowSize, type WindowSizeValue } from "#/components/providers/layout/consts";
import { createContext, useContext } from "react";

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