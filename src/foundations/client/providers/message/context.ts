import { createContext, useContext } from "react";
import type { ButtonProps } from "../../elements/button";

export type HookMessageOptions = {
  quiet?: boolean;
  color?: Color;
  checked?: (ret: any, message: ProviderMessage) => void;
};

export type HookMessage = Api.Message & HookMessageOptions & {
  buttonProps?: ButtonProps;
};

export type HookMessages = HookMessage | Array<HookMessage | null | undefined> | null | undefined;

export type ProviderMessage = HookMessage & {
  verified: boolean;
  displayed: boolean;
  timestamp: number;
};

type MessageContextProps = {
  set: (messages: HookMessages, options?: HookMessageOptions) => void;
  append: (messages: HookMessages, options?: HookMessageOptions) => void;
  error: (e: any, options?: HookMessageOptions) => void;
  clear: () => void;
  messages: Array<ProviderMessage>;
};

export const MessageContext = createContext<MessageContextProps>({
  set: () => { },
  append: () => { },
  error: () => { },
  clear: () => { },
  messages: [],
});

const useMessage = () => {
  return useContext(MessageContext);
};

export default useMessage;