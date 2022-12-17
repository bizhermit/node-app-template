import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import TimeBox from "@/components/elements/form-items/time-box";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "pair-time": "12:00" });

  return (
    <div className="flex-start gap-1 p-1 w-100">
      <Row className="gap-1" $vAlign="bottom">
        <ToggleBox
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleBox
          $tag="readOnly"
          $value={readOnly}
          $onChange={v => setReadOnly(v!)}
        />
      </Row>
      <Row className="gap-1">
        <Button
          $onClick={() => {
            console.log("-------------------");
            console.log("useState: ", value);
            console.log("bind: ", bind);
            console.log("formBind: ", formBind);
          }}
        >
          show value
        </Button>
        <Button
          $outline
          $onClick={() => {
            setValue(null);
          }}
        >
          clear state value
        </Button>
        <Button
          $outline
          $onClick={() => {
            setBind({});
          }}
        >
          clear bind
        </Button>
        <Button
          $outline
          $onClick={() => {
            setFormBind(cur => {
              return {
                "pair-time": cur["pair-time"],
              };
            });
          }}
        >
          clear form bind
        </Button>
        <Button
          $onClick={() => {
            setValue("9:00");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "time-box-bind": "10:00" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind(cur => {
              return {
                ...cur,
                "time-box-form-bind": "18:00",
              };
            });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row $vAlign="top" className="gap-3">
        <TimeBox
          $tag="useState"
          $tagPosition="placeholder"
          $value={value}
          $onChange={v => setValue(v)}
          $disabled={disabled}
          $readOnly={readOnly}
        />
        <TimeBox
          $tag="bind"
          name="time-box-bind"
          $bind={bind}
          $disabled={disabled}
          $readOnly={readOnly}
        />
        <Form
          className="flex-start gap-1"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <TimeBox
            $tag="form bind"
            name="time-box-form-bind"
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
    </div>
  );
};

export default Page;