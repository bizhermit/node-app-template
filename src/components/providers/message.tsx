import { createContext, FC, ReactNode, useContext, useReducer } from "react";

type ArgMessages = Message | Array<Message | null | undefined> | null | undefined;

type MessageContextProps = {
  set: (messages: ArgMessages) => void;
  append: (messages: ArgMessages) => void;
  error: (e: any) => void;
  clear: () => void;
  messages: Array<Message>;
};

const MessageContext = createContext<MessageContextProps>({
  set: () => { },
  append: () => { },
  error: () => { },
  clear: () => { },
  messages: [],
});

export const useMessage = () => {
  return useContext(MessageContext);
};

type ProviderMessage = Message & {
  verified: boolean;
  popuped: boolean;
  timestamp: number;
};

const arrangeMessages = (messages: ArgMessages): Array<ProviderMessage> => {
  if (messages == null) return [];
  const timestamp = Date.now();
  return (Array.isArray(messages) ? messages : [messages])
    .filter(msg => msg != null)
    .map(msg => {
      return {
        ...msg!,
        timestamp,
        popuped: false,
        verified: false,
      };
    });
};

export const MessageProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useReducer((state: Array<ProviderMessage>, action: {
    mode: "set" | "append" | "clear";
    messages?: ArgMessages;
  }) => {
    const msgs = arrangeMessages(messages);
    switch (action.mode) {
      case "clear":
        if (state.length === 0) return state;
        return [];
      case "set":
        return msgs;
      default:
        if (msgs.length === 0) return state;
        return [...state, ...msgs];
    }
  }, []);

  const set = (messages: ArgMessages) => {
    setMessages({ mode: "set", messages });
  };

  const append = (messages: ArgMessages) => {
    setMessages({ mode: "append", messages });
  };

  const error = (e: any) => {
    append({
      type: "error",
      title: "システムエラー",
      name: "system",
      key: "system",
      body: String(e),
    });
  };

  const clear = () => {
    setMessages({ mode: "clear" });
  };

  return (
    <MessageContext.Provider
      value={{
        set,
        append,
        error,
        clear,
        messages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default useMessage;