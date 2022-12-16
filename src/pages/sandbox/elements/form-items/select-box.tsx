import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import SelectBox from "@/components/elements/form-items/select-box";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { colors } from "@/utilities/sandbox";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<number>();
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
            setValue(2);
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "select-box-bind": 3 });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "select-box-form-bind": "main" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <SelectBox
        $tag="useState"
        $value={value}
        $onChange={v => setValue(v!)}
        $disabled={disabled}
        $readOnly={readOnly}
        $source={ArrayUtils.generateArray(10, idx => {
          return {
            value: idx,
            label: `item ${idx}`,
          };
        })}
      />
      <SelectBox
        $tag="bind"
        name="select-box-bind"
        $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
        $source={() => {
          return ArrayUtils.generateArray(10, idx => {
            return {
              value: idx,
              label: `item ${idx}`,
            };
          })
        }}
      />
      <Form
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      >
        <SelectBox
          $tag="form bind"
          name="select-box-form-bind"
          $source={async () => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(colors.map(color => {
                  return {
                    value: color,
                    label: color,
                  };
                }));
              }, 1000);
            });
          }}
        />
      </Form>
    </div>
  );
};

export default Page;