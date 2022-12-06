import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import Slider from "@/components/elements/form-items/slider";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<number>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex-box flex-start p-1 w-100 h-100 gap-1">
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
            setValue(1);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "slider-bind": 2 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "slider-form-bind": 3 });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Slider
        $tag="useState"
        $readOnly={readOnly}
        $disabled={disabled}
        $value={value}
        $onChange={v => setValue(v!)}
      />
      <Slider
        $tag="bind"
        name="slider-bind"
        $bind={bind}
        $readOnly={readOnly}
        $disabled={disabled}
      />
      <Form
        $bind={formBind}
        $readOnly={readOnly}
        $disabled={disabled}
      >
        <Slider
          $tag="form bind"
          name="slider-form-bind"
        />
      </Form>
    </div>
  );
};

export default Page;