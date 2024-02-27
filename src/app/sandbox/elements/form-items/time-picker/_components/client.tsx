"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import TimePicker from "#/client/elements/form/items/time-picker";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_time } from "$/data-items/sample";
import { useState } from "react";

const TimePickerClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<TimeValue>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "pair-time": "12:00" });

  return (
    <div className="flex g-s p-xs w-100">
      <Row className="g-s" $vAlign="bottom">
        <ToggleSwitch
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleSwitch
          $tag="readOnly"
          $value={readOnly}
          $onChange={v => setReadOnly(v!)}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
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
          onClick={() => {
            setValue(null);
          }}
        >
          clear state value
        </Button>
        <Button
          $outline
          onClick={() => {
            setBind({});
          }}
        >
          clear bind
        </Button>
        <Button
          $outline
          onClick={() => {
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
          onClick={() => {
            setValue(540);
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "time-picker-bind": "10:00" });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
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
      <Row className="g-s">
        <TimePicker
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
        />
        <TimePicker
          $tag="time"
          $dataItem={sample_time}
          $onChange={v => console.log("time: ", v)}
        />
      </Row>
      <Row $vAlign="top" className="g-s">
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
          // $bind={bind}
          $disabled={disabled}
          $readOnly={readOnly}
          // $required
          $onClickPositive={(v) => {
            console.log("positive", v);
          }}
        />
        <Form
          className="flex g-s"
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