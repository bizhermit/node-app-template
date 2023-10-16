"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { colors } from "#/utilities/sandbox";
import { sample_boolean, sample_boolean_num, sample_number, sample_string } from "$/data-items/sample/item";
import { useState } from "react";

const ToggleBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<boolean>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex p-xs w-100 g-s">
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
            setBind({ "toggle-box-bind": true });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "toggle-box-form-bind": true });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="g-m">
        <ToggleBox
          $onChange={v => console.log("no item: ", v)}
          $focusWhenMounted
        >
          no item
        </ToggleBox>
        <ToggleBox
          $dataItem={sample_boolean}
          $onChange={v => console.log("boolean: ", v)}
        >
          boolean
        </ToggleBox>
        <ToggleBox
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        >
          number
        </ToggleBox>
        <ToggleBox
          $dataItem={sample_boolean_num}
          $onChange={v => console.log("boolean num: ", v)}
        >
          boolean num
        </ToggleBox>
        <ToggleBox
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        >
          string
        </ToggleBox>
      </Row>
      <Row $vAlign="top" className="g-s">
        <ToggleBox
          $tag="useState"
          $value={value}
          $onChange={v => setValue(v!)}
        >
          トグルボックス
        </ToggleBox>
        <ToggleBox
          $tag="form bind"
          name="toggle-box-bind"
          // $bind={bind}
        >
          ToggleBox
        </ToggleBox>
        <Form
          className="flex g-s"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <ToggleBox
            $tag="form bind"
            name="toggle-box-form-bind"
            $required
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
      {colors.map(color => {
        return (
          <Row key={color}>
            <ToggleBox $color={color} $defaultValue />
            <span className={`pt-t px-s c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default ToggleBoxClient;