import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Menu from "@/components/elements/menu";
import Popup from "@/components/elements/popup";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useRef, useState } from "react";
import { VscArrowDown, VscArrowLeft } from "react-icons/vsc";

const Page: NextPage = () => {
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const [show, setShow] = useState(false);
  const [horizontal, setHorizontal] = useState(false);

  return (
    <div className="flex-start p-1 h-100 w-100 gap-1">
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
        $onClick={() => {
          setShow(true);
        }}
      >
        popup menu
      </Button>
      <Popup
        className="es-3"
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
          className="flex-stretch"
          style={{ width: 500 }}
        >
          <Menu
            $direction={horizontal ? "horizontal" : "vertical"}
            $itemDefaultAttributes={{
              className: "c-base"
            }}
            $defaultClosedIcon={<VscArrowLeft />}
            $defaultOpenedIcon={<VscArrowDown />}
            $items={[{
              key: 1,
              label: `item 1`,
              icon: "1",
              onClick: (props) => {
                console.log(props);
              },
            }, {
              key: 2,
              attributes: {
                // className: "c-primary",
              },
              label: `item parent`,
              icon: "P",
              onClick: (props) => {
                console.log(props);
              },
              defaultOpen: true,
              items: [{
                key: 1,
                attributes: {
                  // className: "c-secondary",
                },
                label: "c-item 1",
                icon: "1",
                onClick: (props) => {
                  console.log(props);
                }
              }, {
                key: 2,
                attributes: {
                  // className: "c-primary",
                },
                label: <Row className="w-100" $hAlign="center">Parent</Row>,
                icon: "P",
                onClick: (props) => {
                  console.log(props);
                },
                items: [{
                  key: 1,
                  attributes: {
                    // className: "c-secondary",
                  },
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
                onClick: (props) => {
                  console.log(props);
                }
              }]
            }]}
          />
        </div>
      </Popup>
    </div>
  );
};

export default Page;