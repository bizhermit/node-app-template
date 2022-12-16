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