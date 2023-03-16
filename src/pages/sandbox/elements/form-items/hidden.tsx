import Button from "@/components/elements/button";
import Divider from "@/components/elements/divider";
import Form, { type FormItemMessageDisplayMode } from "@/components/elements/form";
import Hidden from "@/components/elements/form-items/hidden";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import Row from "@/components/elements/row";
import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [value, setValue] = useState<any>();
  const [messagePos, setMessagePos] = useState<Nullable<FormItemMessageDisplayMode>>();

  return (
    <div className="flex-start p-1 w-100 h-100 gap-1">
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
        className="flex-start gap-1"
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
        <Row className="gap-1">
          <Button type="submit" $ignoreFormValidation>
            submit
          </Button>
          <Button type="reset">
            reset
          </Button>
        </Row>
        <Row className="gap-1">
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
      </Form>
    </div>
  );
};

export default Page;