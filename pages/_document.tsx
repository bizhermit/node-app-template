import { Html, Head, Main, NextScript } from "next/document";

export const Document = () => {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="none" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicons/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;