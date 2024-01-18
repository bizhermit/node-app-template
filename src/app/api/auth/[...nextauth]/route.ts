import nextAuthOptions from "#/auth/options";
import NextAuth from "next-auth/next";

// export const dynamic = "force-static";
// export const generateStaticParams = async () => {
//   return [
//     ["session"],
//     ["providers"],
//     ["csrf"],
//     ["callback", "credentials"],
//     ["signin"],
//     ["signout"],
//   ].map(nextauth => {
//     return { nextauth };
//   });
// };

const handler = NextAuth(nextAuthOptions);

export {
  handler as GET,
  handler as POST
};

