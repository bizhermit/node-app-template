"use client"

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import DateBox, { useDateBox } from "#/client/elements/form/items/date-box";
import DateRangeBox, { useDateRangeBox } from "#/client/elements/form/items/date-range-box";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import Row from "#/client/elements/row";
import { sample_date, sample_month, sample_year } from "$/data-items/sample/item";
import { useState } from "react";

const DateBoxClient = () => {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState<Nullable<DateValue>>();
  const [bind, setBind] = useState({});
  const [formBind, setFormBind] = useState<Struct>({ "date-box-form-bind": new Date() });
  const [type, setType] = useState<"date" | "month" | "year">("date");
  const [disallowInput, setDisallowInput] = useState(false);
  const dateBoxRef = useDateBox();
  const dateRangeBoxRef = useDateRangeBox();

  return (
    <div className="flex p-xs w-100 h-100 g-s">
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
      <Row className="g-s">
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
      <Row className="g-m">
        <DateBox
          $ref={dateBoxRef}
          $tag="no item"
          $onChange={v => console.log("no item: ", v)}
          // $typeof="date"
          $pickerButtonless
          $showSeparatorAlwarys
          $initValue={"2000-1-1"}
          // $defaultValue={"2000-1-1"}
          $required
          $color="main"
        />
        <DateBox
          $tag="date"
          $dataItem={sample_date}
          $onChange={v => console.log("date: ", v)}
          $disallowInput
          $initValue={"2000-1-1"}
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
      </Row>
      <Row className="g-s">
        <Button
          $onClick={() => {
            // formItemRef.focus();
            dateBoxRef.focus();
          }}
        >
          focus
        </Button>
        <Button
          $onClick={() => {
            // console.log(formItemRef.getValue());
            console.log(dateBoxRef.getValue());
          }}
        >
          get value
        </Button>
        <Button
          $onClick={() => {
            // formItemRef.setValue("set from form-item hook");
            dateBoxRef.setValue("2023-12-31");
          }}
        >
          set value
        </Button>
        <Button
          $onClick={() => {
            // formItemRef.setDefaultValue();
            dateBoxRef.setDefaultValue();
          }}
        >
          set default value
        </Button>
        <Button
          $onClick={() => {
            // formItemRef.clear();
            dateBoxRef.clear();
          }}
        >
          clear
        </Button>
        <Button
          $onClick={() => {
            console.log(dateBoxRef.addDay(1));
          }}
        >
          add day
        </Button>
        <Button
          $onClick={() => {
            console.log(dateBoxRef.addMonth());
          }}
        >
          add month
        </Button>
        <Button
          $onClick={() => {
            console.log(dateBoxRef.addYear());
          }}
        >
          add year
        </Button>
        <Button
          $onClick={() => {
            console.log(dateBoxRef.setFirstDate());
          }}
        >
          set first day
        </Button>
        <Button
          $onClick={() => {
            console.log(dateBoxRef.setLastDate());
          }}
        >
          set last date
        </Button>
        <Button
          $onClick={() => {
            console.log("has error", dateBoxRef.hasError());
            console.log(`error message: [${dateBoxRef.getErrorMessage()}]`);
          }}
        >
          error
        </Button>
      </Row>
      <DateRangeBox
        // name="hoge"
        $required
        $onChange={(...args) => {
          console.log(JSON.stringify(args, null, 2));
        }}
      />
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
        // $bind={bind}
        $tag="bind"
        $disabled={disabled}
        $readOnly={readOnly}
        $required
        $disallowInput={disallowInput}
      />
      <Form
        className="flex g-s"
        $bind={formBind}
        $disabled={disabled}
        $readOnly={readOnly}
        action="/api/form"
        method="post"
      >
        <Row $vAlign="bottom" className="g-s">
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
            $onChange={v => {
              console.log("----change date----");
              console.log(v);
            }}
          />
          <span className="h-size pt-t flex column center middle">～</span>
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
        <DateRangeBox
          // name="hogehoge"
          // $dataItem={sample_date}
          $dataItem={sample_date}
          $ref={dateRangeBoxRef}
        />
        <Button
          $onClick={() => {
            dateRangeBoxRef.focus();
          }}
        >
          focus
        </Button>
        <Button type="submit">submit</Button>
      </Form>
    </div>
  );
};

export default DateBoxClient;