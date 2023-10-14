"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { CalendarIcon, ClockIcon, CloudIcon, SaveIcon } from "#/client/elements/icon";
import Row from "#/client/elements/row";
import { sample_number, sample_string } from "$/data-items/sample/item";
import { colors } from "#/utilities/sandbox";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { useState } from "react";

const RadioButtonsClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [appearance, setAppearance] = useState<"point" | "check" | "check-outline" | "button">("point");
  const [outline, setOutline] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
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
        <RadioButtons<"point" | "check" | "check-outline" | "button">
          $tag="appearance"
          $source={[
            { value: "point", label: "Point" },
            { value: "check", label: "Check" },
            { value: "check-outline", label: "Check outline" },
            { value: "button", label: "Button" }
          ]}
          $value={appearance}
          $onChange={v => setAppearance(v!)}
        />
        <ToggleBox
          $tag="outline"
          $value={outline}
          $onChange={v => setOutline(v!)}
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
            setValue(1);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "radio-buttons-bind": 2 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "radio-buttons-form-bind": "primary" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row>
        <RadioButtons
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
          $source={ArrayUtils.generateArray(3, (value) => {
            return { value, label: `item ${value}` };
          })}
          $appearance={appearance}
          $outline={outline}
        />
        <RadioButtons
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
          $source={ArrayUtils.generateArray(3, (value) => {
            return { value: String(value), label: `item ${value}` };
          })}
          $appearance={appearance}
          $outline={outline}
        />
        <RadioButtons
          $allowNull
          $unselectable
          $source={[{
            value: 1,
            label: "selected",
          }]}
          $onChange={console.log}
          $appearance={appearance}
          $outline={outline}
        />
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
        $allowNull
        $unselectable
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
        $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $allowNull
        $messagePosition="bottom"
        $source={ArrayUtils.generateArray(5, idx => {
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
        $onSubmit={(data) => {
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
          $source={ArrayUtils.generateArray(3, idx => {
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