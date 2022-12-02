import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useState } from "react";
import { VscAccount, VscActivateBreakpoints, VscArchive } from "react-icons/vsc";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [appearance, setAppearance] = useState<"check" | "button">("check");
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
        <RadioButtons<"check" | "button">
          $tag="appearance"
          $source={[
            { value: "check", label: "Check" },
            { value: "button", label: "Button" }
          ]}
          $value={appearance}
          $onChange={v => setAppearance(v!)}
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
      <RadioButtons
        $appearance={appearance}
        $disabled={disabled}
        $readOnly={readOnly}
        $color="danger"
        $value={value}
        $onChange={v => setValue(v)}
        $source={[{
          value: 0,
          label: <VscAccount />
        }, {
          value: 1,
          label: <VscActivateBreakpoints />
        }, {
          value: 2,
          label: <VscArchive />
        }]}
      />
      <RadioButtons
        name="radio-buttons-bind"
        $appearance={appearance}
        $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
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
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
      >
        <RadioButtons
          name="radio-buttons-form-bind"
          $appearance={appearance}
          $source={colors.map(color => {
            return {
              value: color,
              label: color,
              color,
            };
          })}
        />
      </Form>
    </div>
  );
};

export default Page;