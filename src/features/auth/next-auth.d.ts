import "next-auth";
import "next-auth/jwt";

type LoginUser = {
  id: number;
  name: string;
  mail_address: string;
}

declare module "next-auth" {
  interface Session {
    user: LoginUser;
  }
  interface User {
    id: number;
    user: LoginUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: LoginUser;
  }
}