"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import CheckBox from "#/client/elements/form/items/check-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { colors } from "#/utilities/sandbox";
import { sample_boolean, sample_boolean_num, sample_boolean_str, sample_number, sample_string } from "$/data-items/sample/item";
import { useState } from "react";

const CheckBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<boolean>(false);
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex p-xs w-100 h-100 g-s">
      <Row className="g-s" $vAlign="bottom">
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
            setValue(null!);
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
            setValue(true);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "check-box-bind": 1 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "check-box-form-bind": true });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-m">
        <CheckBox
          $onChange={v => console.log("no item: ", v)}
          $focusWhenMounted
        >
          no item
        </CheckBox>
        <CheckBox
          $dataItem={sample_boolean}
          $onChange={v => console.log("boolean: ", v)}
        >
          boolean
        </CheckBox>
        <CheckBox
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        >
          number
        </CheckBox>
        <CheckBox
          $dataItem={sample_boolean_num}
          $onChange={v => console.log("boolean num: ", v)}
        >
          boolean num
        </CheckBox>
        <CheckBox
          $dataItem={sample_boolean_str}
          $onChange={v => console.log("boolean str: ", v)}
        >
          boolean str
        </CheckBox>
        <CheckBox
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        >
          string
        </CheckBox>
        <CheckBox
          $outline
          $disabled={disabled}
          $readOnly={readOnly}
        >
          outline
        </CheckBox>
        <CheckBox
          $circle
          $disabled={disabled}
          $readOnly={readOnly}
        >
          circle
        </CheckBox>
        <CheckBox
          $outline
          $circle
          $disabled={disabled}
          $readOnly={readOnly}
        >
          outline/circle
        </CheckBox>
      </Row>
      <Row>
        <CheckBox
          $tag="useState"
          $value={value}
          $onChange={v => setValue(v!)}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          チェックボックス
        </CheckBox>
        <CheckBox
          $tag="bind"
          $bind={bind}
          name="check-box-bind"
          $borderCheck
          $checkedValue={"1"}
          $uncheckedValue={"0"}
          $disabled={disabled}
          $readOnly={readOnly}
          $onChange={v => console.log(v)}
        >
          border check
        </CheckBox>
        <Form
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <Row className="g-m" $vAlign="bottom">
            <CheckBox
              $tag="form bind"
              name="check-box-form-bind"
              $required
            />
            <CheckBox
              $outline
              $required
              $circle
            >
              チェックボックス
            </CheckBox>
            <Button type="submit">submit</Button>
          </Row>
        </Form>
      </Row>
      {colors.map(color => {
        return (
          <Row key={color}>
            <CheckBox $color={color} $defaultValue name={color} />
            <CheckBox $color={color} $borderCheck $defaultValue />
            <CheckBox $color={color} $outline $defaultValue $circle>
              {color}
            </CheckBox>
          </Row>
        );
      })}
    </div>
  );
};

export default CheckBoxClient;