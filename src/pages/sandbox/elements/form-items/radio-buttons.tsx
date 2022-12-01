import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
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
            setValue("");
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
            setValue("set");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "text-box-bind": "set" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "text-box-form-bind": "set" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <RadioButtons
        $disabled={disabled}
        $readOnly={readOnly}
        $source={ArrayUtils.generateArray(5, idx => {
          return {
            value: idx,
            label: `item${idx}`,
          };
        })}
      />
    </div>
  );
};

export default Page;