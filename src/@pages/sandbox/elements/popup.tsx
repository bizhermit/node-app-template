import Button from "#/components/elements/button";
import Form from "#/components/elements/form";
import DateBox from "#/components/elements/form-items/date-box";
import SelectBox from "#/components/elements/form-items/select-box";
import TextBox from "#/components/elements/form-items/text-box";
import Popup from "#/components/elements/popup";
import Row from "#/components/elements/row";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import type { NextPage } from "next";
import { type FC, useRef, useState } from "react";

const Page: NextPage = () => {
  return <Component />;
};

const Component: FC = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  return (
    <div className="flex-center w-100 h-100">
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
        className="e-4 overflow"
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
        <div className="flex-start c-pure r-2 p-2">
          <Form
            className="flex-start p-1 gap-1 border"
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
            <Row $hAlign="center" className="gap-1 w-100">
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

export default Page;