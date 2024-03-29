"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import TimeBox from "#/client/elements/form/items/time-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_time } from "$/data-items/sample";
import { useState } from "react";

const TimeBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<TimeValue>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "pair-time": "12:00" });
  const [disallowInput, setDisallowInput] = useState(false);

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
        <ToggleSwitch
          $tag="disallow input"
          $value={disallowInput}
          $onChange={v => setDisallowInput(v!)}
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
            setBind({ "time-box-bind": "10:00" });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
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
      <Row className="g-s">
        <TimeBox
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
          $showSeparatorAlwarys
          $disallowInput
        />
        <TimeBox
          $tag="time"
          $dataItem={sample_time}
          $onChange={v => console.log("time: ", v)}
        />
      </Row>
      <Row $vAlign="top" className="g-l">
        <TimeBox
          $tag="useState"
          $tagPosition="placeholder"
          $value={value}
          $onChange={v => setValue(v)}
          $disabled={disabled}
          $readOnly={readOnly}
          $max="22:00"
          $min="01:00"
          $minuteInterval={10}
          $required
          $disallowInput={disallowInput}
        />
        <TimeBox
          $tag="bind"
          name="time-box-bind"
          // $bind={bind}
          $disabled={disabled}
          $readOnly={readOnly}
          $typeof="string"
          $minuteInterval={5}
          $disallowInput={disallowInput}
        />
        <Form
          className="flex g-s"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <Row $vAlign="bottom">
            <TimeBox
              $tag="form bind from"
              name="time-box-form-bind"
              $rangePair={{
                name: "time-box-form-bind-to",
                position: "after",
                disallowSame: true,
              }}
              $disallowInput={disallowInput}
            />
            <TimeBox
              $tag="form bind to"
              name="time-box-form-bind-to"
              $rangePair={{
                name: "time-box-form-bind",
                position: "before",
                disallowSame: true,
              }}
              $disallowInput={disallowInput}
            />
          </Row>
          <Button type="submit">submit</Button>
        </Form>
      </Row>
      <TimeBox
        $tag="hm"
      />
      <TimeBox
        $tag="hms"
        $type="hms"
      />
      <TimeBox
        $tag="h"
        $type="h"
      />
      <TimeBox
        $tag="ms"
        $type="ms"
      />
    </div>
  );
};

export default TimeBoxClient;