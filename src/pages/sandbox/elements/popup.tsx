import Button from "@/components/elements/button";
import Form from "@/components/elements/form";
import TextBox from "@/components/elements/form-items/text-box";
import Popup from "@/components/elements/popup";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useRef, useState } from "react";

const Page: NextPage = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  return (
    <div className="flex-box flex-center w-100 h-100">
      <Button
        ref={anchorRef}
        $onClick={() => {
          setShow(true);
        }}
      >
        show
      </Button>
      <Popup
        $show={show}
        $onToggle={(v) => {
          setShow(v);
        }}
        $closeWhenClick
        $mask
        $preventClickEvent
        $anchor={anchorRef}
        $position={{
          x: "center",
          y: "center",
        }}
      >
        <div className="flex-box">
          <Form className="flex-box flex-stretch p-1 gap-1 border">
            <TextBox />
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
        </div>
      </Popup>
    </div>
  );
};

export default Page;