"use client";

import { LayoutProvider } from "#/components/providers/layout";
import LoadingProvider from "#/components/providers/loading";
import { MessageProvider } from "#/components/providers/message";

const RootProvider: RouteFC = ({ children }) => {
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