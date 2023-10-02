"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import DateBox from "#/client/elements/form/items/date-box";
import SelectBox from "#/client/elements/form/items/select-box";
import TextBox from "#/client/elements/form/items/text-box";
import Popup from "#/client/elements/popup";
import Row from "#/client/elements/row";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { type FC, useRef, useState } from "react";

const PopupClient = () => {
  return <Component />;
};

const Component: FC = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  return (
    <div className="flex column center middle w-100 h-100">
      <Button
        // className="mr-auto mb-auto"
        ref={anchorRef}
        $onClick={() => {
          setShow(true);
        }}
      >
        show
      </Button>
      <Popup
        className="es-4 ov-auto"
        $show={show}
        $onToggle={(v) => {
          setShow(v);
        }}
        $mask
        $closeWhenClick
        $preventClickEvent
        $anchor={anchorRef}
        $position={{
          x: "inner",
          y: "outer",
          // absolute: true,
        }}
        // $animationDirection="horizontal"
        // $animationDirection="vertical"
      >
        <div className="flex c-pure r-m p-s">
          <Form
            className="flex p-xs g-s border"
            action="/api/form"
            method="get"
          >
            <TextBox name="text" style={{ width: 300 }} />
            <SelectBox
              name="select"
              $source={ArrayUtils.generateArray(10, (idx) => {
                return {
                  value: idx,
                  label: `item${idx}`,
                };
              })}
            />
            <DateBox
              name="date"
            />
            <Row $hAlign="center" className="g-s w-100">
              <Button type="submit">submit</Button>
              <Button
                $onClick={() => {
                  setShow(false);
                }}
              >
                close
              </Button>
            </Row>
          </Form>
          <Component />
        </div>
      </Popup>
    </div>
  )
};

export default PopupClient;