"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Hidden from "#/client/elements/form/items/hidden";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import Row from "#/client/elements/row";
import { useState } from "react";
import type { FormItemMessageDisplayMode } from "#/client/elements/form/$types";
import Form from "#/client/elements/form";

const HiddenClient = () => {
  const [value, setValue] = useState<any>();
  const [messagePos, setMessagePos] = useState<Nullable<FormItemMessageDisplayMode>>("bottom");

  return (
    <div className="flex p-xs w-100 h-100 g-s">
      <Row>
        <RadioButtons<FormItemMessageDisplayMode>
          $source={[
            { value: "tooltip" },
            { value: "bottom" },
            { value: "bottom-hide" },
            { value: "hide" },
          ]}
          $labelDataName="value"
          $value={messagePos}
          $onChange={setMessagePos}
        />
      </Row>
      <Divider />
      <Form
        className="flex g-s"
        $bind
        $onSubmit={(data) => {
          console.log(JSON.stringify(data, null, 2));
        }}
        $messageDisplayMode={messagePos ?? undefined}
      >
        <Hidden
          name="value"
          $required
          $value={value}
          $onChange={setValue}
        />
        <Hidden
          name="show"
          $required
          $value={value}
          $show
        />
        <Row className="g-s">
          <Button
            type="submit"
            $ignoreFormValidation
          >
            submit
          </Button>
          <Button type="reset">
            reset
          </Button>
        </Row>
        <Row className="g-s">
          <Button
            $onClick={() => setValue(undefined)}
          >
            clear
          </Button>
          <Button
            $onClick={() => setValue("hoge")}
          >
            set string
          </Button>
          <Button
            $onClick={() => setValue(100)}
          >
            set number
          </Button>
          <Button
            $onClick={() => setValue([1, 2, 3])}
          >
            set array
          </Button>
          <Button
            $onClick={() => setValue({ hoge: 1, fuga: "str" })}
          >
            set struct
          </Button>
        </Row>
        <pre>
          {JSON.stringify(value, null, 2)}
        </pre>
      </Form>
    </div>
  );
};

export default HiddenClient;