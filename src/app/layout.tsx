import "$/globals.scss";
import "$/color.scss";
import "$/utility.scss";
import RootProvider from "~/provider";

export const metadata = {
  title: "NodeAppTemplate",
  description: "@bizhermit/node-app-template",
};

const RootLayout: CFC = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
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
