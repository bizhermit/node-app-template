import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: SignInUser;
  }
  interface User {
    id: number;
    data: SignInUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: SignInUser;
  }
}