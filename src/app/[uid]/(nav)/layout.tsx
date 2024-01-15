import Error404 from "#/client/elements/error/404";
import Menu from "#/client/elements/menu";
import NavigationContainer from "#/client/elements/navigation-container";
import getSession from "$/auth/session";
import NavHeader from "@/[uid]/(nav)/_components/header";

const Layout: LayoutFC = async ({ children }) => {
  const session = await getSession();
  if (session == null) {
    return <Error404 />;
  }

  return (
    <NavigationContainer
      $header={<NavHeader user={session.user} />}
      $nav={
        <Menu
          iconSpace
          items={[
            { key: "index" }
          ]}
        />
      }
    >
      {children}
    </NavigationContainer>
  );
};

export default Layout;