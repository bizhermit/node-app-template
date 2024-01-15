"use client";

import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/providers/layout/provider";
import MessageProvider from "#/client/providers/message/provider";
import WindowProvider from "#/client/providers/window/provider";
import { SessionProvider } from "next-auth/react";

const RootProvider: CFC = ({ children }) => {
  return (
    <SessionProvider>
      <WindowProvider>
        <LayoutProvider>
          <MessageProvider>
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </MessageProvider>
        </LayoutProvider>
      </WindowProvider>
    </SessionProvider>
  );
};

export default RootProvider;