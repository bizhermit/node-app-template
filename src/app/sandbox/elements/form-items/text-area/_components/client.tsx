"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import TextArea from "#/client/elements/form/items/text-area";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { sample_string } from "$/data-items/sample";
import { useState } from "react";

const TextAreaClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
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
            setValue("set");
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "text-area-bind": "set" });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "text-area-form-bind": "set" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row $vAlign="top" className="g-s">
        <TextArea
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $value={value}
          $onChange={v => setValue(v)}
          $required
          $messagePosition="bottom"
          $resize
          $width={300}
          $height={300}
          $dataItem={sample_string}
        />
        <TextArea
          name="text-area-bind"
          // $bind={bind}
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          $required
          $resize="x"
        />
        <Form
          className="flex g-s"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <TextArea
            name="text-area-form-bind"
            $tag="form bind"
            $required
            $resize="y"
          />
          <Button type="submit">submit</Button>
        </Form>
        <textarea />
      </Row>
    </div>
  );
};

export default TextAreaClient;