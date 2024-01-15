import { isEmpty } from "#/objects/string/empty";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const isDev = /^dev/.test(process.env.NODE_ENV);

const credentialsError = (status = 401, message: string | null | undefined) => {
  return new Error(JSON.stringify({ status, message }));
};

const nextAuthOptions: NextAuthOptions = {
  debug: isDev,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1, // NOTE: 1 day
  },
  providers: [
    Credentials({
      name: "signin",
      credentials: {
        mail_address: {
          label: "mail address",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          if (credentials == null) {
            throw credentialsError(401, "not set inputs.");
          }
          const { mail_address, password } = credentials;
          // eslint-disable-next-line no-console
          console.log("sign-in:", { mail_address, password });
          if (isEmpty(mail_address) || isEmpty(password)) {
            throw credentialsError(401, "input empty.");
          }
          return {
            id: 1,
            user: {
              id: 1,
              name: "signin user",
              mail_address,
            },
          };
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          throw e;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user.user;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  }
};

export default nextAuthOptions;