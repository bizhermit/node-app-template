"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import RadioButtons, { useRadioButtons } from "#/client/elements/form/items/radio-buttons";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import { CalendarIcon, ClockIcon, CloudIcon, SaveIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import generateArray from "#/objects/array/generator";
import { colors } from "#/utilities/sandbox";
import { sample_number, sample_string } from "$/data-items/sample";
import { useState } from "react";

const RadioButtonsClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [appearance, setAppearance] = useState<"point" | "check" | "check-fill" | "button">("point");
  const [outline, setOutline] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const radioButtonsRef = useRadioButtons();

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
        <RadioButtons<"point" | "check" | "check-fill" | "button">
          $tag="appearance"
          $source={[
            { value: "point", label: "Point" },
            { value: "check", label: "Check" },
            { value: "check-fill", label: "Check fill" },
            { value: "button", label: "Button" }
          ]}
          $value={appearance}
          $onChange={v => setAppearance(v!)}
        />
        <ToggleSwitch
          $tag="outline"
          $value={outline}
          $onChange={v => setOutline(v!)}
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
            setValue(1);
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "radio-buttons-bind": 2 });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "radio-buttons-form-bind": "primary" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row>
        <RadioButtons
          $ref={radioButtonsRef}
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
          $source={generateArray(3, (value) => {
            return { value, label: `item ${value}` };
          })}
          $appearance={appearance}
          $null="unselectable"
          $outline={outline}
        />
        <RadioButtons
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
          $source={generateArray(3, (value) => {
            return { value: String(value), label: `item ${value}` };
          })}
          $appearance={appearance}
          $outline={outline}
        />
        <RadioButtons
          $null="unselectable"
          $source={[{
            value: 1,
            label: "selected",
          }]}
          $onChange={console.log}
          $appearance={appearance}
          $outline={outline}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
            // formItemRef.focus();
            radioButtonsRef.focus();
          }}
        >
          focus
        </Button>
        <Button
          onClick={() => {
            // console.log(formItemRef.getValue());
            console.log(radioButtonsRef.getValue());
          }}
        >
          get value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setValue("set from form-item hook");
            radioButtonsRef.setValue(1);
          }}
        >
          set value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setDefaultValue();
            radioButtonsRef.setDefaultValue();
          }}
        >
          set default value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.clear();
            radioButtonsRef.clear();
          }}
        >
          clear
        </Button>
      </Row>
      <RadioButtons
        // style={{ width: 500 }}
        $tag="useState"
        $appearance={appearance}
        $outline={outline}
        $disabled={disabled}
        $readOnly={readOnly}
        $color="danger"
        $value={value}
        $onChange={v => setValue(v)}
        $required
        $null="unselectable"
        $messagePosition="bottom"
        $source={[{
          value: 0,
          label: <CalendarIcon />,
          state: "active",
        }, {
          value: 1,
          label: <ClockIcon />,
          state: "readonly",
        }, {
          value: 2,
          label: <SaveIcon />,
          state: "disabled",
        }, {
          value: 3,
          label: <CloudIcon />,
          state: "hidden",
        }]}
      />
      <RadioButtons
        name="radio-buttons-bind"
        $tag="bind"
        $appearance={appearance}
        $outline={outline}
        // $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $messagePosition="bottom"
        $source={generateArray(5, idx => {
          return {
            value: idx,
            label: `item${idx}`,
            color: idx === 3 ? "primary" : undefined,
          };
        })}
        $onChange={(a, b, data) => {
          console.log(a, b, data);
        }}
      />
      <Form
        className="flex g-s"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
        onSubmit={(data) => {
          console.log(data);
        }}
      >
        <RadioButtons
          $tag="form bind"
          name="radio-buttons-form-bind"
          $appearance={appearance}
          $outline={outline}
          $source={colors.map((color, count) => {
            return {
              value: color,
              label: color,
              color,
              count,
            };
          })}
          $tieInNames={[
            "color",
            { dataName: "label", hiddenName: "colorLabel" },
            "count",
          ]}
        />
        <Button type="submit">submit</Button>
      </Form>
      <Row $vAlign="top" className="g-s">
        <RadioButtons
          // style={{ width: 200 }}
          $appearance={appearance}
          $outline={outline}
          $readOnly={readOnly}
          $disabled={disabled}
          $direction="vertical"
          $source={generateArray(3, idx => {
            return {
              value: idx,
              label: `item${idx}`,
            };
          })}
        />
        <RadioButtons
          $appearance={appearance}
          $outline={outline}
          $readOnly={readOnly}
          $disabled={disabled}
          $direction="vertical"
          $source={colors.map(color => {
            return {
              value: color,
              label: color,
              color,
            };
          })}
        />
        <RadioButtons
          $appearance={appearance}
          $outline={outline}
          $disabled={disabled}
          $readOnly={readOnly}
          $color="danger"
          $direction="vertical"
          $source={[{
            value: 0,
            label: <CalendarIcon />
          }, {
            value: 1,
            label: <ClockIcon />
          }, {
            value: 2,
            label: <SaveIcon />
          }]}
        />
      </Row>
    </div>
  );
};

export default RadioButtonsClient;