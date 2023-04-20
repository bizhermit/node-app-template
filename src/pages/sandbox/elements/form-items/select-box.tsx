import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import SelectBox from "@/components/elements/form-items/select-box";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { sample_number, sample_string } from "@/data-items/sample/item";
import { colors } from "@/utilities/sandbox";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<number>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [disallowInput, setDisallowInput] = useState(false);

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
        <ToggleBox
          $tag="disallow input"
          $value={disallowInput}
          $onChange={v => setDisallowInput(v!)}
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
      <Row className="gap-2">
        <SelectBox
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
          $source={ArrayUtils.generateArray(30, value => {
            return {
              value,
              label: `item ${value}`,
            };
          })}
        />
        <SelectBox
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
          $source={ArrayUtils.generateArray(30, value => {
            return {
              value: String(value),
              label: `item ${value}`,
            };
          })}
          $tieInNames={["label", "value"]}
        />
      </Row>
      <SelectBox
        $tag="useState"
        $tagPosition="placeholder"
        $value={value}
        $onChange={v => setValue(v!)}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $resize
        $source={ArrayUtils.generateArray(30, idx => {
          return {
            value: idx,
            label: `item ${idx}`,
          };
        })}
        $emptyItem="(未選択)"
        $disallowInput={disallowInput}
      />
      <SelectBox
        $tag="bind"
        name="select-box-bind"
        $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        // $hideClearButton
        $emptyItem={{
          value: "",
          label: "(empty)",
        }}
        $source={() => {
          return ArrayUtils.generateArray(10, idx => {
            return {
              value: idx,
              label: `item ${idx}`,
            };
          })
        }}
        $disallowInput={disallowInput}
      />
      <Form
        className="flex-start gap-1"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
        // $onSubmit={(data) => {
        //   console.log(data);
        // }}
      >
        <SelectBox
          $tag="form bind"
          name="select-box-form-bind"
          $required
          $source={async () => {
            return new Promise<Array<Struct>>(resolve => {
              setTimeout(() => {
                let count = 0;
                resolve(colors.map(color => {
                  return {
                    value: color,
                    label: color,
                    count: count++,
                  };
                }));
              }, 1000);
            });
          }}
          $disallowInput={disallowInput}
          $tieInNames={["value", { dataName: "label", hiddenName: "selectBoxLabel"}, "count"]}
        />
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default Page;