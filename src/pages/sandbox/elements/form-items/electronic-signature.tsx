import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import ElectronicSignature from "@/components/elements/form-items/electronic-signature";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [autoSave, setAutoSave] = useState(true);
  const [buttonsPosition, setButtonsPosition] = useState<"hide" | "top" | "left" | "bottom" | "right">();

  return (
    <div className="flex-start h-100 w-100 p-1 gap-1">
      <Row className="gap-1" $vAlign="bottom">
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
        <ToggleBox
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
      <Row className="gap-1">
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
      </Row>
      <Divider />
      <Row className="gap-1">
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
          $bind={bind}
          $autoSave={autoSave}
          $buttonsPosition={buttonsPosition}
          $required
        />
        <Form
          className="flex-start gap-1"
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

export default Page;