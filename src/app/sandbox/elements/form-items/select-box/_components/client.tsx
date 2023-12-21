"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import SelectBox, { useSelectBox } from "#/client/elements/form/items/select-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import generateArray from "#/objects/array/generator";
import { colors } from "#/utilities/sandbox";
import { sample_number, sample_string } from "$/data-items/sample";
import { useRef, useState } from "react";

const SelectBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<number>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [disallowInput, setDisallowInput] = useState(false);
  const ref = useRef<HTMLDivElement>();
  const selectBoxRef = useSelectBox();

  return (
    <div className="flex p-xs w-100 g-s">
      {/* <div style={{ height: "100vh" }}></div> */}
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
        <ToggleBox
          $tag="disallow input"
          $value={disallowInput}
          $onChange={v => setDisallowInput(v!)}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
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
          onClick={() => {
            setValue(null!);
          }}
        >
          clear state value
        </Button>
        <Button
          $outline
          onClick={() => {
            setBind({});
          }}
        >
          clear bind
        </Button>
        <Button
          $outline
          onClick={() => {
            setFormBind({});
          }}
        >
          clear form bind
        </Button>
        <Button
          onClick={() => {
            setValue(2);
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "select-box-bind": 3 });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
            setFormBind({ "select-box-form-bind": "main" });
          }}
        >
          set form bind
        </Button>
        <Button
          onClick={() => {
            console.log(ref.current);
          }}
        >
          ref
        </Button>
      </Row>
      <Divider />
      <Row className="g-m">
        <SelectBox
          ref={ref}
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
          // $source={generateArray(30, value => {
          //   return {
          //     value,
          //     label: `item ${value}`,
          //   };
          // })}
          // $ref={selectBoxRef}
        />
        <SelectBox
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
          // $source={generateArray(30, value => {
          //   return {
          //     value: String(value),
          //     label: `item ${value}`,
          //   };
          // })}
          $tieInNames={["label", "value"]}
          $ref={selectBoxRef}
        />
        <SelectBox<number>
          $tag="number"
          $onChange={v => console.log("number: ", v)}
          $source={generateArray(30, value => {
            return {
              value,
              label: `item ${value}`,
            };
          })}
        />
        <SelectBox<"item1" | "item2" | 3>
          $tag="string"
          $onChange={v => console.log("string: ", v)}
          $source={generateArray(30, value => {
            return {
              value: String(value),
              label: `item ${value}`,
            };
          })}
          $tieInNames={["label", "value"]}
        />
      </Row>
      <Row className="g-s">
        <Button
          onClick={() => {
            // formItemRef.focus();
            selectBoxRef.focus();
          }}
        >
          focus
        </Button>
        <Button
          onClick={() => {
            // console.log(formItemRef.getValue());
            console.log(selectBoxRef.getValue());
          }}
        >
          get value
        </Button>
        <Button
          onClick={() => {
            console.log(selectBoxRef.getData());
          }}
        >
          get data
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setValue("set from form-item hook");
            selectBoxRef.setValue("2");
          }}
        >
          set value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.setDefaultValue();
            selectBoxRef.setDefaultValue();
          }}
        >
          set default value
        </Button>
        <Button
          onClick={() => {
            // formItemRef.clear();
            selectBoxRef.clear();
          }}
        >
          clear
        </Button>
      </Row>
      <SelectBox
        $tag="useState"
        $tagPosition="placeholder"
        $initValue={18}
        $value={value}
        $onChange={v => {
          console.log("change", v);
          setValue(v!);
        }}
        $onEdit={v => console.log("edit", v)}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $resize
        $source={generateArray(30, idx => {
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
        // $bind={bind}
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $onChange={v => console.log("change", v)}
        $onEdit={v => console.log("edit", v)}
        // $hideClearButton
        $emptyItem={{
          value: null,
          label: "(empty)",
        }}
        $source={() => {
          return generateArray(10, idx => {
            return {
              value: idx,
              label: `item ${idx}`,
            };
          })
        }}
        $disallowInput={disallowInput}
      />
      <Form
        className="flex g-s"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      // onSubmit={(data) => {
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
          $tieInNames={["value", { dataName: "label", hiddenName: "selectBoxLabel" }, "count"]}
        />
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default SelectBoxClient;