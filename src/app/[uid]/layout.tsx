import getSession from "#/auth/session";
import Error404 from "#/client/elements/error/404";
import { SignedInProvider } from "@/[uid]/_components/signed-in-provider";

const Layout: LayoutFC = async ({ children }) => {
  const session = await getSession();
  if (session == null) {
    return <Error404 />;
  }

  return (
    <SignedInProvider
      user={session.user}
    >
      {children}
    </SignedInProvider>
  );
};

export default Layout;
