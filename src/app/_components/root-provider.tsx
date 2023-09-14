"use client";

import LoadingProvider from "#/client/elements/loading/provider";
import LayoutProvider from "#/client/providers/layout/provider";
import MessageProvider from "#/client/providers/message/provider";

const RootProvider: CFC = ({ children }) => {
  return (
    <LayoutProvider>
      <MessageProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </MessageProvider>
    </LayoutProvider>
  );
};

export default RootProvider;