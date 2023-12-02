import NavigationContainer from "#/client/elements/navigation-container";

const Layout: LayoutFC = ({ children }) => {
  return (
    <NavigationContainer
      $header={
        <div>
          header/headerhe
          {/* ader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/headerheader/header */}
          <br />
          header
        </div>
      }
      $footer={
        <div>
          footer
        </div>
      }
      $nav={
        <div>
          <span style={{ whiteSpace: "nowrap" }}>
            navnavnav
            navnavnav
            navnavnav
          </span>
          <br />
          navnavnav
          navnavnav
          navnavnav
          <br />
          navnavnav
          navnavnav
          navnavnav
          <br />
          navnavnav
          navnavnav
          navnavnav
          <br />
          navnavnav
          navnavnav
          navnavnav
          {/* <div
            style={{
              height: "200vh",
              width: "10rem",
            }}
          >

          </div> */}
          {/* <Menu
            $items={[
              {
                key: "index",
                icon: "H",
                label: "HOME",
                pathname: "/",
              },
            ]}
          /> */}
        </div>
      }
    >
      {children}
    </NavigationContainer>
  );
};

export default Layout;