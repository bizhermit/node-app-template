import "#/client/styles/color.scss";
import "#/client/styles/root.scss";
import "$/client/styles/global.scss";
import RootProvider from "./_components/root-provider";

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
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;