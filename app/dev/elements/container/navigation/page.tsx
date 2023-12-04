"use client";

import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { NavigationMode, NavigationPosition, useNavigation } from "#/client/elements/navigation-container/context";
import StructView from "#/client/elements/struct-view";

const Page = () => {
  const nav = useNavigation();

  return (
    <>
      <h1
        style={{
          position: "sticky",
          top: "var(--header-size)",
          // height: "var(--header-size)",
          zIndex: 90,
          background: "var(--c-base)",
          padding: "0 var(--b-s)",
        }}
      >
        Navigation Container
      </h1>
      <div style={{ padding: "var(--b-s)" }}>
        <div>
          <StructView
            $keys={[
              { key: "navPos" },
              { key: "navMode" },
            ]}
            $value={nav}
          />
          <Divider />
          <div>
            <RadioButtons<NavigationPosition>
              $source={[
                "left",
                "right",
              ].map(v => {
                return { value: v, label: v };
              })}
              $value={nav.navPos}
              $onChange={v => {
                nav.setNavPos(v!);
              }}
              $tag="position"
            />
            <RadioButtons<NavigationMode>
              $source={[
                "auto",
                "visible",
                "minimize",
                "manual",
              ].map(v => {
                return { value: v, label: v };
              })}
              $value={nav.navMode}
              $onChange={v => {
                nav.setNavMode(v!);
              }}
              $tag="mode"
            />
          </div>
        </div>
        <div
          style={{
            position: "sticky",
            top: "calc(var(--header-size) * 2)",
          }}
        >
          sticky
        </div>
        <div
          style={{
            height: "150vh",
            // height: "10rem",
            // height: "100%",
            // width: "150vw",
            // width: "10rem",
            // width: "100%",
            background: "linear-gradient(-225deg, var(--c-main) 0%, var(--c-sub) 100%)",
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            // justifyContent: "flex-end",
            // alignItems: "flex-end",
            borderRadius: 10,
            wordBreak: "break-all",
            padding: 20,
          }}
        >
          bodybodybodybodybodybodybodybodybody
          {/* bodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybody */}
        </div>
      </div>
    </>
  );
};

export default Page;