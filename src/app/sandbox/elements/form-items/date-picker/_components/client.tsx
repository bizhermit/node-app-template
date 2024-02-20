"use client"

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import DatePicker from "#/client/elements/form/items/date-picker";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import TextBox from "#/client/elements/form/items/text-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import Row from "#/client/elements/row";
import { sample_date, sample_month, sample_year } from "$/data-items/sample";
import { useState } from "react";

const DatePickerClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<DateValue>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "pair-date": "2022-12-11" });
  const [type, setType] = useState<"date" | "month" | "year">("date");
  const [buttonless, setButtonless] = useState(false);

  return (
    <div className="flex p-xs w-100 h-100 g-s">
      <Row className="g-s" $vAlign="bottom">
        <ToggleSwitch
          $tag="disabled"
          $value={disabled}
          $onChange={v => setDisabled(v!)}
        />
        <ToggleSwitch
          $tag="readOnly"
          $value={readOnly}
          $onChange={v => setReadOnly(v!)}
        />
        <ToggleSwitch
          $tag="buttonless"
          $value={buttonless}
          $onChange={v => setButtonless(v!)}
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
            setValue(null);
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
          onClick={() => {
            setValue("2022-12-10");
          }}
        >
          set state value
        </Button>
        <Button
          onClick={() => {
            setBind({ "date-picker-bind": ["2022-12-10", "2022-12-12", "2022-12-13"] });
          }}
        >
          set bind
        </Button>
        <Button
          onClick={() => {
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
      <Row className="g-s">
        <DatePicker
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
          // $multiple
          $validations={[
            (v) => {
              console.log(v);
              return undefined;
            }
          ]}
          $buttonless={buttonless}
        />
        <DatePicker
          $tag="date"
          $dataItem={sample_date}
          $onChange={v => console.log("date: ", v)}
          $multiple
          $buttonless={buttonless}
        />
        <DatePicker
          $tag="month"
          $dataItem={sample_month}
          $onChange={v => console.log("month: ", v)}
          // $multiple
          $buttonless={buttonless}
        />
        <DatePicker
          $tag="year"
          $dataItem={sample_year}
          $onChange={v => console.log("year: ", v)}
          // $multiple
          $buttonless={buttonless}
        />
      </Row>
      <Row className="g-s" $vAlign="top">
        <DatePicker
          $tag="useState"
          $disabled={disabled}
          $readOnly={readOnly}
          $type={type}
          $value={value}
          $typeof="date"
          $onChange={v => {
            console.log(v);
            setValue(v)
          }}
          $required
          $messagePosition="bottom"
          $onClickPositive={(value) => {
            console.log("positive", value);
          }}
          // $onClickNegative={() => {
          //   console.log("negative");
          // }}
          $min="2022-12-20"
          $max="2022-12-25"
          // $validDays="weekday"
          $validDaysMode="disallow"
          // $validDays={[
          //   { date: "2022-12-15", valid: true },
          //   { date: "2022-12-16", valid: true },
          //   { date: "2022-12-18", valid: true },
          //   { date: "2022-12-20", valid: true },
          // ]}
          $validDays={[
            "2022-12-15",
            "2022-12-16",
            "2022-12-18",
            "2022-12-20",
          ]}
        />
        <DatePicker
          name="date-picker-bind"
          // $bind={bind}
          $tag="bind"
          $disabled={disabled}
          $readOnly={readOnly}
          $type={type}
          $required
          $multiple
          $monthTexts="en-s"
        // $max="2022-12-10"
        />
        <Form
          className="flex g-s"
          $bind={formBind}
          $disabled={disabled}
          $readOnly={readOnly}
          method="post"
          action="/api/form"
        >
          <DatePicker
            name="date-picker-form-bind"
            $tag="form bind"
            $required
            $type={type}
            $rangePair={{
              name: "pair-date",
              position: "after",
            }}
          />
          <TextBox
            name="pair-date"
            placeholder="range pair date"
            $interlockValidation
          />
          <Button type="submit">submit</Button>
        </Form>
      </Row>
    </div>
  );
};

export default DatePickerClient;