"use client";

import LoadingProvider from "#/components/elements/loading/provider";
import LayoutProvider from "#/components/providers/layout/provider";
import MessageProvider from "#/components/providers/message/provider";

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