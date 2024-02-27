"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import ElectronicSignature, { useElectronicSignature } from "#/client/elements/form/items/electronic-signature";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_file, sample_string } from "$/data-items/sample";
import { useState } from "react";

const ElectronicSignatureClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [autoSave, setAutoSave] = useState(true);
  const [buttonsPosition, setButtonsPosition] = useState<"hide" | "top" | "left" | "bottom" | "right">();
  const elecSignRef = useElectronicSignature();

  return (
    <div className="flex h-100 w-100 p-xs g-s">
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
          $tag="auto save"
          $value={autoSave}
          $onChange={v => setAutoSave(v!)}
        />
        <RadioButtons
          $tag="buttons position"
          $value={buttonsPosition}
          $onChange={v => setButtonsPosition(v!)}
          $source={[
            { value: "right", label: "right" },
            { value: "bottom", label: "bottom" },
            { value: "top", label: "top" },
            { value: "left", label: "left" },
            { value: "hide", label: "hide" },
          ]}
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
      </Row>
      <Divider />
      <ElectronicSignature
        $ref={elecSignRef}
        $tag="no item"
        $onChange={v => console.log("no item: ", v)}
        $color="main"
      />
      <Button
        onClick={() => {
          elecSignRef.focus();
        }}
      >
        focus
      </Button>
      <ElectronicSignature
        $tag="base64"
        $dataItem={sample_string}
        $onChange={v => console.log("base64: ", v)}
      />
      <ElectronicSignature
        $tag="file"
        $dataItem={sample_file}
        $onChange={v => console.log("file: ", v)}
      />
      <Row className="g-s">
        <ElectronicSignature
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $autoSave={autoSave}
          $buttonsPosition={buttonsPosition}
          $value={value}
          $onChange={v => setValue(v)}
          $required
        />
        <ElectronicSignature
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          name="electronic-signature-bind"
          // $bind={bind}
          $autoSave={autoSave}
          $buttonsPosition={buttonsPosition}
          $required
        />
        <Form
          className="flex g-s"
          $disabled={disabled}
          $readOnly={readOnly}
          $bind={formBind}
          action="/api/form"
          method="post"
        >
          <ElectronicSignature
            $tag="form bind"
            name="electronic-signature-form-bind"
            $autoSave={autoSave}
            $buttonsPosition={buttonsPosition}
            $required
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
    </div>
  );
};

export default ElectronicSignatureClient;