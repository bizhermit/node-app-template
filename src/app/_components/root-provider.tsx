"use client";

import LoadingProvider from "#/client/elements/loading/provider";
import FetchApiProvider from "#/client/hooks/fetch-api/provider";
import LayoutProvider from "#/client/hooks/layout/provider";
import MessageProvider from "#/client/hooks/message/provider";
import WindowProvider from "#/client/hooks/window/provider";
import { SessionProvider } from "next-auth/react";

const RootProvider: CFC = ({ children }) => {
  return (
    <SessionProvider>
      <WindowProvider>
        <LayoutProvider>
          <LoadingProvider>
            <MessageProvider>
              <FetchApiProvider>
                {children}
              </FetchApiProvider>
            </MessageProvider>
          </LoadingProvider>
        </LayoutProvider>
      </WindowProvider>
    </SessionProvider>
  );
};

export default RootProvider;