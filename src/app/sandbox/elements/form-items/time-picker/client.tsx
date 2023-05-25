"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import TimePicker from "#/components/elements/form-items/time-picker";
import ToggleBox from "#/components/elements/form-items/toggle-box";
import Row from "#/components/elements/row";
import { sample_number, sample_string, sample_time } from "@/data-items/sample/item";
import { useState } from "react";

const TimePickerClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
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
            setValue(540);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "time-picker-bind": "10:00" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind(cur => {
              return {
                ...cur,
                "time-picker-form-bind": "18:00",
              };
            });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="gap-1">
        <TimePicker
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
        />
        <TimePicker
          $tag="time"
          $dataItem={sample_time}
          $onChange={v => console.log("time: ", v)}
        />
        <TimePicker
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        />
        <TimePicker
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        />
      </Row>
      <Row $vAlign="top" className="gap-1">
        <TimePicker
          $tag="useState"
          $value={value}
          $onChange={v => setValue(v!)}
          $disabled={disabled}
          $readOnly={readOnly}
          // $required
          $onClickPositive={(v) => {
            console.log("positive", v);
          }}
          $onClickNegative={() => {
            console.log("negative");
          }}
          $min="1:15"
          $max="12:00"
          $minuteInterval={5}
        />
        <TimePicker
          $tag="bind"
          name="time-picker-bind"
          $bind={bind}
          $disabled={disabled}
          $readOnly={readOnly}
          // $required
          $onClickPositive={(v) => {
            console.log("positive", v);
          }}
        />
        <Form
          className="flex-start gap-1"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <TimePicker
            $tag="form bind"
            name="time-picker-form-bind"
            $type="hms"
            $required
            $min="1:23:45"
            $max="23:45:01"
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
    </div>
  );
};

export default TimePickerClient;