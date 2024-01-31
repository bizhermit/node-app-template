"use client";

import { useEffect, useReducer, type FC, type ReactNode } from "react";
import useMessageBox from "../../elements/message-box";
import { MessageContext, type HookMessageOptions, type HookMessages, type ProviderMessage } from "./context";

const arrangeMessages = (messages: HookMessages, options?: HookMessageOptions): Array<ProviderMessage> => {
  if (messages == null) return [];
  const timestamp = Date.now();
  return (Array.isArray(messages) ? messages : [messages])
    .filter(msg => msg != null)
    .map(msg => {
      return {
        ...options,
        ...msg!,
        timestamp,
        displayed: false,
        verified: false,
      };
    });
};

const MessageProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const msgBox = useMessageBox({ preventUnmountClose: true });
  const [messages, setMessages] = useReducer((state: Array<ProviderMessage>, action: {
    mode: "set" | "append" | "clear";
    messages?: HookMessages;
    options?: HookMessageOptions;
  }) => {
    const msgs = arrangeMessages(action.messages, action.options);
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

  const set = (messages: HookMessages, options?: HookMessageOptions) => {
    setMessages({ mode: "set", messages, options });
  };

  const append = (messages: HookMessages, options?: HookMessageOptions) => {
    setMessages({ mode: "append", messages, options });
  };

  const error = (e: any, options?: HookMessageOptions) => {
    append({
      type: "error",
      title: "system",
      body: String(e),
    }, options);
  };

  const clear = () => {
    setMessages({ mode: "clear" });
  };

  useEffect(() => {
    const msg = messages[messages.length - 1];
    if (msg && !msg.displayed && msg.quiet !== true) {
      msg.displayed = true;
      msgBox.alert({
        header: msg.title,
        body: msg.body,
        color: (() => {
          if (msg.color) return msg.color;
          switch (msg.type) {
            case "error": return "danger";
            case "warning": return "warning";
            default: return "main";
          }
        })(),
        buttonProps: msg.buttonProps,
      }).then((ret) => {
        msg.checked?.(ret, msg);
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

export default MessageProvider;