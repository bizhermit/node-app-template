"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import NumberBox, { useNumberBox } from "#/client/elements/form/items/number-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_number } from "$/data-items/sample";
import { useState } from "react";

const NumberBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "number-box-form-bind": "1111" });
  const [disallowInput, setDisallowInput] = useState(false);
  const numberBoxRef = useNumberBox();

  return (
    <div className="flex p-xs w-100 h-100 g-s">
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
            setFormBind({});
          }}
        >
          clear form bind
        </Button>
        <Button
          onClick={() => {
            setValue(1001);
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "number-box-bind": 1001 });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "number-box-form-bind": 1001 });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-s">
        <NumberBox
          $ref={numberBoxRef}
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
            // formItemRef.focus();
            numberBoxRef.focus();
          }}
        >
          focus
        </Button>
        <Button
          onClick={() => {
            // console.log(formItemRef.getValue());
            console.log(numberBoxRef.getValue());
          }}
        >
          get value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setValue("set from form-item hook");
            numberBoxRef.setValue(1);
          }}
        >
          set value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setDefaultValue();
            numberBoxRef.setDefaultValue();
          }}
        >
          set default value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.clear();
            numberBoxRef.clear();
          }}
        >
          clear
        </Button>
        <Button
          onClick={() => {
            numberBoxRef.up();
          }}
        >
          up
        </Button>
        <Button
          onClick={() => {
            numberBoxRef.down();
          }}
        >
          down
        </Button>
        <Button
          onClick={() => {
            numberBoxRef.add(123);
          }}
        >
          add
        </Button>
      </Row>
      <NumberBox
        $tag="useState"
        $tagPosition="placeholder"
        $disabled={disabled}
        $readOnly={readOnly}
        $value={value}
        $onChange={v => setValue(v)}
        $required
        $messagePosition="bottom"
        // $messageWrap
        $resize
        $disallowInput={disallowInput}
      />
      <NumberBox
        name="number-box-bind"
        // $bind={bind}
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $max={10}
        $min={5}
        $float={1}
        $step={0.5}
        $hideButtons
        $preventThousandSeparate
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
        <NumberBox
          name="number-box-form-bind"
          $tag="form bind"
          $required
          $disallowInput={disallowInput}
        />
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default NumberBoxClient;