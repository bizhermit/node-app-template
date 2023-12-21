/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import Menu, { MenuProps } from "#/client/elements/menu";
import Popup from "#/client/elements/popup";
import Row from "#/client/elements/row";
import BaseLayout, { BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useRef, useState } from "react";

const Page = () => {
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const [show, setShow] = useState(false);
  const [direction, setDirection] = useState<MenuProps["direction"]>();

  return (
    <BaseLayout title="Menu">
      <ControlLayout>
        <ControlItem caption="direction">
          <RadioButtons
            $unselectable
            $allowNull
            $value={direction}
            $onChange={v => setDirection(v!)}
            $source={[
              { value: "vertical", label: "vertical" },
              { value: "horizontal", label: "horizontal" },
            ]}
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <Button
          ref={buttonRef}
          onClick={() => {
            if (!show) setShow(true);
          }}
        >
          popup menu
        </Button>
        <Popup
          // $preventElevatation
          $show={show}
          $onToggle={v => setShow(v)}
          $anchor={buttonRef}
          $position={direction === "horizontal" ? {
            x: "outer",
            y: "inner",
          } : {
            x: "inner",
            y: "outer",
          }}
          $closeWhenClick
          $preventClickEvent
          $animationDirection={direction}
          $animationDuration={80}
        >
          <BaseSection>
            <Menu
              direction={direction}
              items={[{
                key: 1,
                label: `item 1`,
                icon: "1",
                onClick: (props) => {
                  console.log(props);
                },
              }, {
                key: 2,
                className: "fgc-primary",
                label: `item parent`,
                icon: "P",
                onClick: (props) => {
                  console.log(props);
                },
                defaultOpen: true,
                items: [{
                  key: 1,
                  className: "fgc-secondary",
                  label: "c-item 1",
                  icon: "1",
                  onClick: (props) => {
                    console.log(props);
                  }
                }, {
                  key: 2,
                  className: "fgc-primary",
                  label: <Row className="w-100" $hAlign="center">Parent</Row>,
                  icon: "P",
                  onClick: (props) => {
                    console.log(props);
                  },
                  items: [{
                    key: 1,
                    className: "fgc-secondary",
                    label: "c-item 1",
                    icon: "1",
                    onClick: (props) => {
                      console.log(props);
                    }
                  }, {
                    key: 2,
                    label: "c-item 2",
                    icon: "2",
                    onClick: (props) => {
                      console.log(props);
                    }
                  }]
                }, {
                  key: 3,
                  label: "c-item 3",
                  icon: "3",
                  // onClick: (props) => {
                  //   console.log(props);
                  // }
                }]
              }]}
            />
          </BaseSection>
        </Popup>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;