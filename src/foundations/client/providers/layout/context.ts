import { createContext, useContext } from "react";
import { WindowSize, type WindowSizeValue } from "./consts";

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