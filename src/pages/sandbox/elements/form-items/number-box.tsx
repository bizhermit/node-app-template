import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import NumberBox from "@/components/elements/form-items/number-box";
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
            setValue(1001);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "number-box-bind": 1001 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "number-box-form-bind": 1001 });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <NumberBox
        $tag="useState"
        $disabled={disabled}
        $readOnly={readOnly}
        $value={value}
        $onChange={v => setValue(v)}
        $required
        $messagePosition="bottom"
        $resize
      />
      <NumberBox
        name="number-box-bind"
        $bind={bind}
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $max={10}
        $min={5}
        $float={1}
        $step={0.5}
        $hideButtons
        $preventThousandSeparate
      />
      <Form
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
      >
        <NumberBox
          name="number-box-form-bind"
          $tag="form bind"
          $required
        />
      </Form>
    </div>
  );
};

export default Page;