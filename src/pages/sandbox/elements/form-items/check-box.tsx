import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import CheckBox from "@/components/elements/form-items/check-box";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<boolean>(false);
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
            setBind({ "check-box-bind": 1 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "check-box-form-bind": true });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row>
        <CheckBox
          $tag="useState"
          $value={value}
          $onChange={v => setValue(v!)}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          ????????????????????????
        </CheckBox>
        <CheckBox
          $tag="bind"
          $bind={bind}
          name="check-box-bind"
          $outline
          $checkedValue={1}
          $uncheckedValue={0}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          outline
        </CheckBox>
        <Form
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          action="/api/form"
          method="post"
        >
          <Row $vAlign="bottom">
            <CheckBox
              $tag="form bind"
              name="check-box-form-bind"
            />
            <Button type="submit">submit</Button>
          </Row>
        </Form>
      </Row>
      {colors.map(color => {
        return (
          <Row key={color}>
            <CheckBox $color={color} $defaultValue name={color} />
            <CheckBox $color={color} $outline $defaultValue />
            <span className={`pt-t px-1 c-${color}`}>{color}</span>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;