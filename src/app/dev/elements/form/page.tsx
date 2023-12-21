/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import Form, { useFormRef } from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import BaseLayout, { BaseRow, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const Page = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // const [type, setType] = useState<FormProps["$type"]>();
  const [bind, setBind] = useState<Struct>();
  const [preventEnterSubmit, setPreventEnterSubmit] = useState(false);
  const formRef = useFormRef();

  return (
    <BaseLayout title="Form">
      <ControlLayout>
        <ControlItem caption="readonly">
          <ToggleBox
            $value={readOnly}
            $onChange={v => setReadOnly(v!)}
          />
        </ControlItem>
        <ControlItem caption="disabled">
          <ToggleBox
            $value={disabled}
            $onChange={v => setDisabled(v!)}
          />
        </ControlItem>
        {/* <ControlItem caption="data type">
          <RadioButtons<"formData" | "struct">
            $unselectable
            $allowNull
            $value={type}
            $onChange={setType}
            $source={[
              { value: "formData", label: "formData" },
              { value: "struct", label: "struct" }
            ]}
          />
        </ControlItem> */}
        <ControlItem caption="bind">
          <BaseRow>
            <Button $fitContent onClick={() => setBind(undefined)}>not set</Button>
            <Button
              $fitContent
              onClick={() => {
                setBind({ text: "bind" });
              }}
            >
              set
            </Button>
          </BaseRow>
        </ControlItem>
        <ControlItem caption="prevent enter submit">
          <ToggleBox
            $value={preventEnterSubmit}
            $onChange={v => setPreventEnterSubmit(v!)}
          />
        </ControlItem>
        <ControlItem caption="ref">
          <Button
            onClick={() => {
              console.log(formRef.getValue("text"));
            }}
          >
            get text value
          </Button>
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <Form
          $layout="flex"
          // $type={type as any}
          // $type="formData"
          // $type="struct"
          $readOnly={readOnly}
          $disabled={disabled}
          $bind={bind}
          $preventEnterSubmit={preventEnterSubmit}
          $formRef={formRef}
          onSubmit={async (...args) => {
            console.log("submit start");
            console.log(args);
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("submit end");
          }}
          onReset={() => {
            // console.log("reset start");
            // await new Promise(resolve => setTimeout(resolve, 2000));
            // console.log("reset end");
            // return true;
          }}
        >
          <TextBox
            name="text"
            $required
            $defaultValue="default"
          />
          <BaseRow>
            <Button type="submit">submit</Button>
            <Button type="reset">reset</Button>
          </BaseRow>
        </Form>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;