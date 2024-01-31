import LoadingProvider from "#/client/elements/loading/provider";
import FetchApiProvider from "#/client/hooks/fetch-api/provider";
import LayoutProvider from "#/client/hooks/layout/provider";
import MessageProvider from "#/client/hooks/message/provider";
import WindowProvider from "#/client/hooks/window/provider";
import "#/client/styles/color.scss";
import "#/client/styles/root.scss";
import "$/client/styles/global.scss";
import SessionProvider from "../foundations/auth/client-session-provider";

export const metadata = {
  title: "NodeAppTemplate",
  description: "@bizhermit/node-app-template",
  viewport: "width=device-width,initial-scale=1",
  robots: "none",
};

const RootLayout: LayoutFC = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicons/favicon.ico" />
      </head>
      <body>
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
      </body>
    </html>
  );
};

export default RootLayout;