import useMessageBox from "@/hooks/message-box";
import { createContext, type FC, type ReactNode, useContext, useEffect, useReducer } from "react";

type ArgMessages = Message | Array<Message | null | undefined> | null | undefined;

type ProviderMessage = Message & {
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

const arrangeMessages = (messages: ArgMessages): Array<ProviderMessage> => {
  if (messages == null) return [];
  const timestamp = Date.now();
  return (Array.isArray(messages) ? messages : [messages])
    .filter(msg => msg != null)
    .map(msg => {
      return {
        ...msg!,
        timestamp,
        displayed: false,
        verified: false,
      };
    });
};

export const MessageProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const msgBox = useMessageBox({ preventUnmountClose: true });
  const [messages, setMessages] = useReducer((state: Array<ProviderMessage>, action: {
    mode: "set" | "append" | "clear";
    messages?: ArgMessages;
  }) => {
    const msgs = arrangeMessages(action.messages);
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

  useEffect(() => {
    const msg = messages[messages.length - 1];
    if (msg && !msg.displayed) {
      msg.displayed = true;
      msgBox.alert({
        header: msg.title,
        body: msg.body,
        color: (() => {
          switch (msg.type) {
            case "error": return "danger";
            case "warning": return "warning";
            default: return "main";
          }
        })(),
      });
    }
  }, [messages]);

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