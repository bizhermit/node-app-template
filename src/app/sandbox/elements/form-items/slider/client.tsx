"use client";

import Button from "#/components/elements/button";
import Divider from "#/components/elements/divider";
import Form from "#/components/elements/form";
import Slider from "#/components/elements/form-items/slider";
import ToggleBox from "#/components/elements/form-items/toggle-box";
import Row from "#/components/elements/row";
import { sample_number, sample_string } from "$/data-items/sample/item";
import { colors } from "#/utilities/sandbox";
import { useState } from "react";

const SliderClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex-start p-1 w-100 h-100 gap-1">
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
        <Button
          $onClick={() => {
            setValue(10);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "slider-bind": 50 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "slider-form-bind": 100 });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="gap-2">
        <Slider
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        />
        <Slider
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        />
      </Row>
      <Slider
        $tag="useState"
        $readOnly={readOnly}
        $disabled={disabled}
        $value={value}
        $onChange={v => setValue(v!)}
        $width={200}
      />
      <Slider
        $tag="bind"
        name="slider-bind"
        $bind={bind}
        $readOnly={readOnly}
        $disabled={disabled}
        $step={10}
      />
      <Form
        $bind={formBind}
        $readOnly={readOnly}
        $disabled={disabled}
        action="/api/form"
        method="post"
      >
        <Row $vAlign="bottom" className="gap-1">
          <Slider
            $tag="form bind"
            name="slider-form-bind"
          />
          <Button type="submit">submit</Button>
        </Row>
      </Form>
      {colors.map(color => {
        return (
          <Slider
            key={color}
            $color={color}
            $defaultValue={50}
            className="w-100"
            $width="100%"
          />
        );
      })}
    </div>
  );
};

export default SliderClient;