import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { sample_boolean, sample_number, sample_string } from "@/data-items/sample/item";
import { colors } from "@/utilities/sandbox";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<boolean>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});

  return (
    <div className="flex-start p-1 w-100 gap-1">
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
      <Row className="gap-2">
        <ToggleBox
          $onChange={v => console.log("no item: ", v)}
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
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        >
          string
        </ToggleBox>
      </Row>
      <Row $vAlign="top" className="gap-1">
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
          $bind={bind}
        >
          ToggleBox
        </ToggleBox>
        <Form
          className="flex-start gap-1"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <ToggleBox
            $tag="form bind"
            name="toggle-box-form-bind"
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
      {colors.map(color => {
        return (
          <Row key={color}>
            <ToggleBox $color={color} $defaultValue />
            <span className={`pt-t px-1 c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;