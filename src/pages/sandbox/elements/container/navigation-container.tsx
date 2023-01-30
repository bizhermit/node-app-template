import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import { NavigationFooterVisible, NavigationHeaderVisible, NavigationMode, NavigationPosition, useNavigation } from "@/components/elements/navigation-container";
import Row from "@/components/elements/row";
import StructView from "@/components/elements/struct-view";
import { NextPage } from "next";

const Page: NextPage = () => {
  const navigation = useNavigation();

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <StructView
        $keys={[
          { key: "navigationPosition" },
          { key: "navigationMode" },
          { key: "navigationState" },
          { key: "headerVisible" },
          { key: "footerVisible" },
        ]}
        $value={navigation}
      />
      <Divider />
      <RadioButtons<NavigationPosition>
        $source={[
          "left",
          "right",
          "top",
          "bottom"
        ].map(v => {
          return { value: v, label: v };
        })}
        $value={navigation.navigationPosition}
        $onChange={v => {
          navigation.setNavigationPosition(v!);
        }}
        $tag="navigation position"
      />
      <RadioButtons<NavigationMode>
        $source={[
          "auto",
          "visible",
          "minimize",
          "manual",
          "none",
        ].map(v => {
          return { value: v, label: v };
        })}
        $value={navigation.navigationMode}
        $onChange={v => {
          navigation.setNavigationMode(v!);
        }}
        $tag="navigation mode"
      />
      <RadioButtons<NavigationHeaderVisible>
        $source={[
          "always",
          "none",
        ].map(v => {
          return { value: v, label: v };
        })}
        $value={navigation.headerVisible}
        $onChange={v => {
          navigation.setHeaderVisible(v!);
        }}
        $tag="header"
      />
      <RadioButtons<NavigationFooterVisible>
        $source={[
          "always",
          "end",
          "none",
        ].map(v => {
          return { value: v, label: v };
        })}
        $value={navigation.footerVisible}
        $onChange={v => {
          navigation.setFooterVisible(v!);
        }}
        $tag="footer"
      />
      <Divider />
      <Row className="gap-1">
        <Button
          $onClick={() => {
            navigation.toggle(true);
          }}
        >
          open
        </Button>
        <Button
          $onClick={() => {
            navigation.toggle(false);
          }}
        >
          close
        </Button>
      </Row>
    </div>
  );
};

export default Page;