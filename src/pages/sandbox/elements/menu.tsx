import Button from "@/components/elements/button";
import Menu from "@/components/elements/menu";
import Popup from "@/components/elements/popup";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex-box flex-start p-1 h-100 w-100">
      <Button
        $onClick={() => {
          setShow(true);
        }}
      >
        popup menu
      </Button>
      <Popup
        className="e-3 r-2"
        $show={show}
        $onToggle={v => setShow(v)}
        $closeWhenClick
        $preventClickEvent
      >
        <div className="flex-box flex-stretch p-1">
          <Menu
            $items={[{
              key: 1,
              label: `item 1`,
              icon: "1",
              onClick: (props) => {
                console.log(props);
              },
            }, {
              key: 2,
              label: `item parent`,
              icon: "P",
              onClick: (props) => {
                console.log(props);
              },
              items: [{
                key: 1,
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
            }]}
          />
        </div>
      </Popup>
    </div>
  );
};

export default Page;