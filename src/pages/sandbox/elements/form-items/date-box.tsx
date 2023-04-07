import Button from "@/components/elements/button";
import DateBox from "@/components/elements/form-items/date-box";
import Divider from "@/components/elements/divider";
import Form from "@/components/elements/form";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import type { NextPage } from "next";
import { useState } from "react";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import { sample_date, sample_month, sample_number, sample_string, sample_year } from "@/data-items/sample/item";

const Page: NextPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<string>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState({});
  const [type, setType] = useState<"date" | "month" | "year">("date");
  const [disallowInput, setDisallowInput] = useState(false);

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
        <RadioButtons
          $tag="type"
          $value={type}
          $onChange={v => setType(v!)}
          $source={[
            { value: "date", label: "date" },
            { value: "month", label: "month" },
            { value: "year", label: "year" },
          ]}
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
            setValue("2022-12-10");
          }}
        >
          set state value
        </Button>
        <Button
          $onClick={() => {
            setBind({ "date-box-bind": "2022-12-10" });
          }}
        >
          set bind
        </Button>
        <Button
          $onClick={() => {
            setFormBind({ "date-box-form-bind": "2022-12-10" });
          }}
        >
          set form bind
        </Button>
      </Row>
      <Divider />
      <Row className="gap-2">
        <DateBox
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
          // $typeof="date"
          $pickerButtonless
          $showSeparatorAlwarys
        />
        <DateBox
          $tag="date"
          $dataItem={sample_date}
          $onChange={v => console.log("date: ", v)}
          $disallowInput
        />
        <DateBox
          $tag="month"
          $dataItem={sample_month}
          $onChange={v => console.log("month: ", v)}
        />
        <DateBox
          $tag="year"
          $dataItem={sample_year}
          $onChange={v => console.log("year: ", v)}
        />
        <DateBox
          $tag="string"
          $dataItem={sample_string}
          $onChange={v => console.log("string: ", v)}
        />
        <DateBox
          $tag="number"
          $dataItem={sample_number}
          $onChange={v => console.log("number: ", v)}
        />
      </Row>
      <DateBox
        $type={type}
        $tag="useState"
        $disabled={disabled}
        $readOnly={readOnly}
        $value={value}
        $onChange={v => setValue(v)}
        $required
        $disallowInput={disallowInput}
        $messagePosition="bottom"
        $min="2022-12-05"
        $max="2022-12-26"
      />
      <DateBox
        $type={type}
        name="date-box-bind"
        $bind={bind}
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $disallowInput={disallowInput}
      />
      <Form
        className="flex-start gap-1"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      >
        <Row $vAlign="bottom" className="gap-1">
          <DateBox
            $type={type}
            name="date-box-form-bind"
            $tag="form bind"
            $required
            $disallowInput={disallowInput}
            $rangePair={{
              name: "date-box-form-bind-pair",
              position: "after",
              disallowSame: true,
            }}
          />
          <span className="h-size pt-t flex-center">～</span>
          <DateBox
            $type={type}
            $tag="pair"
            name="date-box-form-bind-pair"
            $disallowInput={disallowInput}
            $rangePair={{
              name: "date-box-form-bind",
              position: "before",
              disallowSame: true,
            }}
          />
        </Row>
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default Page;