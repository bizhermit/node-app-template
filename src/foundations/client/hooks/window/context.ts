import { createContext } from "react";
import { windowOpen } from "../../utilities/window-open";

export type WindowOptions = {
  closeWhenUnmount?: boolean;
  closeWhenPageMove?: boolean;
  closeWhenTabClose?: boolean;
};

export type WindowContextParams = {
  window: ReturnType<typeof windowOpen>;
  options: WindowOptions | null | undefined;
};

type WindowContextProps = {
  append: (ctx: ReturnType<typeof windowOpen>) => void;
};

export const WindowContext = createContext<WindowContextProps>({
  append: () => { },
});