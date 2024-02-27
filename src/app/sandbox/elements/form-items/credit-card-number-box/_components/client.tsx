"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import { useTextBox } from "#/client/elements/form/items/text-box";
import CreditCardNumberBox from "#/client/elements/form/items/text-box/credit-card";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_string } from "$/data-items/sample";
import { useState } from "react";

const CreditCardCreditCardNumberBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [disallowInput, setDisallowInput] = useState(false);
  const textBoxRef = useTextBox();

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
            setBind({ "cc-number-box-bind": 1001 });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "cc-number-box-form-bind": 1001 });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-s">
        <CreditCardNumberBox
          $tag="string"
          $dataItem={sample_string}
          // $onChange={v => console.log("string: ", v)}
          $ref={textBoxRef}
        />
        <Button onClick={() => textBoxRef.focus()}>
          focus
        </Button>
        <Button onClick={() => console.log(textBoxRef.getValue())}>
          get value
        </Button>
        <Button onClick={() => textBoxRef.setValue("hogehoge")}>
          set value
        </Button>
        <Button onClick={() => textBoxRef.setDefaultValue()}>
          set default value
        </Button>
        <Button onClick={() => textBoxRef.clear()}>
          clear
        </Button>
      </Row>
      <CreditCardNumberBox
        name="cc-number-box-bind"
        // $bind={bind}
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        $required
      />
      <Form
        className="flex g-s"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      >
        <CreditCardNumberBox
          name="cc-number-box-form-bind"
          $tag="form bind"
          $required
        />
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default CreditCardCreditCardNumberBoxClient;