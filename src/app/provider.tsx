"use client";

import { LoadingProvider } from "#/components/elements/loading";
import { LayoutProvider } from "#/components/providers/layout";
import { MessageProvider } from "#/components/providers/message";

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