import "next-auth";
import "next-auth/jwt";

type SignInUser = {
  id: number;
  name: string;
  mail_address: string;
}

declare module "next-auth" {
  interface Session {
    user: SignInUser;
  }
  interface User {
    id: number;
    user: SignInUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: SignInUser;
  }
}