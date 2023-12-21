import { createContext, useContext } from "react";

export type MessageHookOptions = {
  checked?: (ret: any, message: ProviderMessage) => void;
};

export type ArgMessages = (Api.Message & MessageHookOptions) | Array<(Api.Message & MessageHookOptions) | null | undefined> | null | undefined;

export type ProviderMessage = Api.Message & MessageHookOptions & {
  verified: boolean;
  displayed: boolean;
  timestamp: number;
};

type MessageContextProps = {
  set: (messages: ArgMessages, options?: MessageHookOptions) => void;
  append: (messages: ArgMessages, options?: MessageHookOptions) => void;
  error: (e: any, options?: MessageHookOptions) => void;
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