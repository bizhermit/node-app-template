"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import RadioButtons from "#/components/elements/form/items/radio-buttons";
import { type NavigationPosition, useNavigation, NavigationMode, NavigationHeaderVisible, NavigationFooterVisible } from "#/components/elements/navigation-container/context";
import Row from "#/components/elements/row";
import StructView from "#/components/elements/struct-view";

const NavigationClient = () => {
  const navigation = useNavigation();

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <StructView
        $keys={[
          { key: "position" },
          { key: "mode" },
          { key: "state" },
          { key: "headerVisible" },
          { key: "footerVisible" },
        ]}
        $value={navigation}
      />
      <Divider />
      <Row className="gap-1">
        <Button $onClick={() => navigation.setPosition("default")}>default</Button>
        <RadioButtons<NavigationPosition>
          $source={[
            "left",
            "right",
            "top",
            "bottom"
          ].map(v => {
            return { value: v, label: v };
          })}
          $value={navigation.position}
          $onChange={v => {
            navigation.setPosition(v!);
          }}
          $tag="navigation position"
        />
      </Row>
      <Row className="gap-1">
        <Button $onClick={() => navigation.setMode("default")}>default</Button>
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
          $value={navigation.mode}
          $onChange={v => {
            navigation.setMode(v!);
          }}
          $tag="navigation mode"
        />
      </Row>
      <Row className="gap-1">
        <Button $onClick={() => navigation.setHeaderVisible("default")}>default</Button>
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
      </Row>
      <Row className="gap-1">
        <Button $onClick={() => navigation.setFooterVisible("default")}>default</Button>
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
      </Row>
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

export default NavigationClient;