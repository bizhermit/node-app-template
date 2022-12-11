import Button from "@/components/elements/button";
import DatePicker from "@/components/elements/form-items/date-picker";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { NextPage } from "next";
import { useState } from "react";
import TextBox from "@/components/elements/form-items/text-box";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "pair-date": "2022-12-11" });

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
            setFormBind(cur => {
              return {
                "pair-date": cur["pair-date"],
              };
            });
          }}
        >
          clear form bind
        </Button>
        <Button
          $onClick={() => {
            setValue("2022-12-10");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "date-picker-bind": ["2022-12-10", "2022-12-12", "2022-12-13"] });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind(cur => {
              return {
                ...cur,
                "date-picker-form-bind": "2022-12-10",
              };
            });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="gap-1" $vAlign="top">
        <DatePicker
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $value={value}
          $onChange={v => setValue(v)}
          $required
          $messagePosition="bottom"
          $onClickPositive={(value) => {
            console.log("positive", value);
          }}
          // $onClickNegative={() => {
          //   console.log("negative");
          // }}
          $min="2020-01-01"
          $max="2025-12-31"
        />
        <DatePicker
          name="date-picker-bind"
          $bind={bind}
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          $required
          $multiable
          $monthTexts="en"
        />
        <Form
          className="flex-box"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          <DatePicker
            name="date-picker-form-bind"
            $tag="form bind"
            $required
            $rangePair={{
              name: "pair-date",
              position: "after",
            }}
          />
          <TextBox
            name="pair-date"
            placeholder="range pair date"
          />
        </Form>
      </Row>
    </div>
  );
};

export default Page;