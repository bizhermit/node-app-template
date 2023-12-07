"use client";

import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { NavigationHeaderMode, NavigationMode, NavigationPosition, useNavigation } from "#/client/elements/navigation-container/context";
import BaseLayout from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";

const Page = () => {
  const nav = useNavigation();

  return (
    <BaseLayout
      title="Navigation Container"
    >
      <ControlLayout>
        <ControlItem caption="position">
          <RadioButtons<NavigationPosition>
            $source={[
              "left",
              "right",
            ].map(v => {
              return { value: v, label: v };
            })}
            $value={nav.position}
            $onChange={v => {
              nav.setPosition(v!);
            }}
          />
        </ControlItem>
        <ControlItem caption="mode">
          <RadioButtons<NavigationMode>
            $source={[
              "auto",
              "visible",
              "minimize",
              "manual",
            ].map(v => {
              return { value: v, label: v };
            })}
            $value={nav.mode}
            $onChange={v => {
              nav.setMode(v!);
            }}
          />
        </ControlItem>
        <ControlItem caption="header mode">
          <RadioButtons<NavigationHeaderMode>
            $source={[
              "fill",
              "sticky",
              "scroll",
            ].map(v => {
              return { value: v, label: v };
            })}
            $value={nav.headerMode}
            $onChange={v => {
              nav.setHeaderMode(v!);
            }}
          />
        </ControlItem>
      </ControlLayout>
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
    </BaseLayout>
  );
};

export default Page;