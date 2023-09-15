"use client";

import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/providers/layout/provider";
import MessageProvider from "#/client/providers/message/provider";
import WindowProvider from "#/client/providers/window/provider";

const RootProvider: CFC = ({ children }) => {
  return (
    <WindowProvider>
      <LayoutProvider>
        <MessageProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </MessageProvider>
      </LayoutProvider>
    </WindowProvider>
  );
};

export default RootProvider;