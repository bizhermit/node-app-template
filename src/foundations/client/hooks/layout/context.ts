import { createContext } from "react";
import { WindowSize, type WindowSizeValue } from "./consts";

type LayoutContextProps = {
  windowSize: WindowSizeValue;
  mobile: boolean;
};

export const LayoutContext = createContext<LayoutContextProps>({
  windowSize: WindowSize.m,
  mobile: false,
});