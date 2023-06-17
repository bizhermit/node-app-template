import "#/styles/globals.scss";
import "#/styles/color.scss";
import "#/styles/utility.scss";
import RootProvider from "@/provider";

export const metadata = {
  title: "NodeAppTemplate",
  description: "@bizhermit/node-app-template",
};

const RootLayout: LayoutFC = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta name="robots" content="none" />
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