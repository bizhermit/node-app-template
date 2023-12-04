"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { NavigationMode, useNavigation, type NavigationPosition } from "#/client/elements/navigation-container/context";
import Row from "#/client/elements/row";
import StructView from "#/client/elements/struct-view";

const NavigationClient = () => {
  const navigation = useNavigation();

  return (
    <div className="flex w-100 h-100 p-xs g-s">
      <StructView
        $keys={[
          { key: "navPos" },
          { key: "navMode" },
        ]}
        $value={navigation}
      />
      <Divider />
      <Row className="g-s">
        <RadioButtons<NavigationPosition>
          $source={[
            "left",
            "right",
          ].map(v => {
            return { value: v, label: v };
          })}
          $value={navigation.navPos}
          $onChange={v => {
            navigation.setNavPos(v!);
          }}
          $tag="navigation position"
        />
      </Row>
      <Row className="g-s">
        <RadioButtons<NavigationMode>
          $source={[
            "auto",
            "visible",
            "minimize",
            "manual",
          ].map(v => {
            return { value: v, label: v };
          })}
          $value={navigation.navMode}
          $onChange={v => {
            navigation.setNavMode(v!);
          }}
          $tag="navigation mode"
        />
      </Row>
      <Divider />
      <Row className="g-s">
        <Button
          $onClick={() => {
            navigation.toggle();
          }}
        >
          toggle
        </Button>
      </Row>
      <div
        style={{
          height: "100rem",
          width: "100rem",
          background: "linear-gradient(-225deg, var(--c-main) 0%, var(--c-sub) 100%)",
        }}
      />
    </div>
  );
};

export default NavigationClient;