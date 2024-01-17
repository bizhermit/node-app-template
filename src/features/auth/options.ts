import { isEmpty } from "#/objects/string/empty";
import { signin_mailAddress, signin_password } from "$/data-items/signin";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const isDev = /^dev/.test(process.env.NODE_ENV);

const credentialsError = (message: string | null | undefined) => {
  return new Error(JSON.stringify({ status: 401, message }));
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
        [signin_mailAddress.name]: {
          label: signin_mailAddress.label,
          type: "text",
        },
        [signin_password.name]: {
          label: signin_password.label,
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          if (credentials == null) {
            throw credentialsError("not set inputs.");
          }
          const mailAddress = credentials[signin_mailAddress.name];
          const password = credentials[signin_password.name];
          // eslint-disable-next-line no-console
          console.log("sign-in:", { mailAddress, password });
          if (isEmpty(mailAddress) || isEmpty(password)) {
            throw credentialsError("input empty.");
          }
          if (password !== "pass") {
            throw credentialsError("password not matched.");
          }
          return {
            id: 1,
            data: {
              id: 1,
              name: "signin user",
              mail_address: mailAddress,
            }
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
    signIn: "/sign-in",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.email = user.data.mail_address;
        token.picture = user.image;
        token.user = user.data;
      }
      return token;
    },
    session: ({ session, token: { user } }) => {
      session.user = user;
      return session;
    },
  }
};

export default nextAuthOptions;