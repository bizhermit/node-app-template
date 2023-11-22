"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import PasswordBox, { usePasswordBox } from "#/client/elements/form/items/text-box/password";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { useState } from "react";

const PasswordBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const passwordBoxRef = usePasswordBox();

  return (
    <div className="flex p-xs g-s">
      <Row className="g-s">
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
      <Row className="g-s">
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
            setFormBind({});
          }}
        >
          clear form bind
        </Button>
        <Button
          $onClick={() => {
            setValue("set");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "text-box-bind": "set" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "text-box-form-bind": "set" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-s">
        <PasswordBox
          // $round
          // $hideToggleButton
          // $hideClearButton
          $ref={passwordBoxRef}
        />
        <Button $onClick={() => passwordBoxRef.focus()}>
          focus
        </Button>
        <Button $onClick={() => console.log(passwordBoxRef.getValue())}>
          get value
        </Button>
        <Button $onClick={() => passwordBoxRef.setValue("pass")}>
          set value
        </Button>
        <Button $onClick={() => passwordBoxRef.setDefaultValue()}>
          set default value
        </Button>
        <Button $onClick={() => passwordBoxRef.clear()}>
          clear
        </Button>
        <Button $onClick={() => passwordBoxRef.toggleMask()}>
          toggle mask
        </Button>
        {/* <TextBox
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $value={value}
          // $length={4}
          $preventInputWithinLength
          $charType="h-num"
          $onChange={v => setValue(v)}
          $error="ex error"
        />
        <TextBox
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          name="text-box-bind"
          $bind={bind}
        />
        <Form
          $bind={formBind}
          $readOnly={readOnly}
          $disabled={disabled}
          action="/api/form"
          method="post"
        >
          <Row $vAlign="bottom" className="g-s">
            <TextBox
              $tag="form bind"
              name="text-box-form-bind"
            />
            <Button type="submit">submit</Button>
          </Row>
        </Form> */}
      </Row>
    </div>
  );
};

export default PasswordBoxClient;