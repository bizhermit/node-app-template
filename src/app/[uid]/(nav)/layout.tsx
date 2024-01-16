import Error404 from "#/client/elements/error/404";
import NavigationContainer from "#/client/elements/navigation-container";
import getSession from "$/auth/session";
import NavHeader from "./_components/header";
import Nav from "./_components/nav";

const Layout: LayoutFC = async ({ children }) => {
  const session = await getSession();
  if (session == null) {
    return <Error404 />;
  }

  return (
    <NavigationContainer
      $header={<NavHeader user={session.user} />}
      $nav={<Nav user={session.user} />}
    >
      {children}
    </NavigationContainer>
  );
};

export default Layout;