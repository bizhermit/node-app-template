"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { DoubleDownIcon, DoubleLeftIcon } from "#/client/elements/icon";
import Menu from "#/client/elements/menu";
import Popup from "#/client/elements/popup";
import Row from "#/client/elements/row";
import { useRef, useState } from "react";

const MenuClient = () => {
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const [show, setShow] = useState(false);
  const [horizontal, setHorizontal] = useState(false);

  return (
    <div className="flex p-xs h-100 w-100 g-s">
      <Row>
        <ToggleBox
          $tag="horizontal"
          $value={horizontal}
          $onChange={v => setHorizontal(v!)}
        />
      </Row>
      <Divider />
      <Button
        ref={buttonRef}
        onClick={() => {
          if (!show) setShow(true);
        }}
      >
        popup menu
      </Button>
      <Popup
        // className="es-3 r-s"
        $elevatation
        $show={show}
        $onToggle={v => setShow(v)}
        $anchor={buttonRef}
        $position={{
          x: "inner",
          y: "outer",
        }}
        $closeWhenClick
        $preventClickEvent
        $animationDirection={horizontal ? "horizontal" : "vertical"}
      >
        <div
          className="flex column"
        // style={{ width: 500 }}
        >
          <Menu
            direction={horizontal ? "horizontal" : "vertical"}
            closedIcon={<DoubleLeftIcon />}
            defaultOpenedIcon={<DoubleDownIcon />}
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
        </div>
      </Popup>
    </div>
  );
};

export default MenuClient;