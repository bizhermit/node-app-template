import { createContext, useContext } from "react";

export type ArgMessages = Message | Array<Message | null | undefined> | null | undefined;

export type ProviderMessage = Message & {
  verified: boolean;
  displayed: boolean;
  timestamp: number;
};

type MessageContextProps = {
  set: (messages: ArgMessages) => void;
  append: (messages: ArgMessages) => void;
  error: (e: any) => void;
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