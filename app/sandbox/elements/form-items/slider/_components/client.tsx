"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import Slider from "#/client/elements/form/items/slider";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { colors } from "#/utilities/sandbox";
import { sample_number } from "$/data-items/sample/item";
import { useState } from "react";

const SliderClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "slider-form-bind": "50" });

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
      <Row className="g-m">
        <Slider
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
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
        // $bind={bind}
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
        <Row $vAlign="bottom" className="g-s">
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