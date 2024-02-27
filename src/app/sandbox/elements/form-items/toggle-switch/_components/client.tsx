"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { colors } from "#/utilities/sandbox";
import { sample_boolean, sample_boolean_num, sample_number, sample_string } from "$/data-items/sample";
import { useState } from "react";

const ToggleSwitchClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<boolean>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex p-xs w-100 g-s">
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
            setValue(null!);
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
            setFormBind({});
          }}
        >
          clear form bind
        </Button>
        <Button
          onClick={() => {
            setValue(true);
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "toggle-switch-bind": true });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "toggle-switch-form-bind": true });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-m">
        <ToggleSwitch
          $onChange={v => console.log("no item: ", v)}
          $focusWhenMounted
        >
          no item
        </ToggleSwitch>
        <ToggleSwitch
          $dataItem={sample_boolean}
          $onChange={v => console.log("boolean: ", v)}
        >
          boolean
        </ToggleSwitch>
        <ToggleSwitch
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        >
          number
        </ToggleSwitch>
        <ToggleSwitch
          $dataItem={sample_boolean_num}
          $onChange={v => console.log("boolean num: ", v)}
        >
          boolean num
        </ToggleSwitch>
        <ToggleSwitch
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        >
          string
        </ToggleSwitch>
      </Row>
      <Row $vAlign="top" className="g-s">
        <ToggleSwitch
          $tag="useState"
          $value={value}
          $onChange={v => setValue(v!)}
        >
          トグルボックス
        </ToggleSwitch>
        <ToggleSwitch
          $tag="form bind"
          name="toggle-switch-bind"
          // $bind={bind}
        >
          ToggleBox
        </ToggleSwitch>
        <Form
          className="flex g-s"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <ToggleSwitch
            $tag="form bind"
            name="toggle-switch-form-bind"
            $required
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
      {colors.map(color => {
        return (
          <Row key={color}>
            <ToggleSwitch $color={color} $defaultValue>
              {color}
            </ToggleSwitch>
            <span className={`pt-t px-s c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default ToggleSwitchClient;