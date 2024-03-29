/* eslint-disable no-console */
"use client";

import CheckList from "#/client/elements/form/items/check-list";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import arrayItem from "#/data-items/array";
import $str from "#/data-items/string";
import { useState } from "react";
import BaseLayout, { BaseSection, BaseSheet } from "../../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../../_components/control-layout";

const strItem = $str({
  name: "str",
  label: "STR",
  source: [
    { value: "hoge", label: "HOGE" },
    { value: "fuga", label: "FUGA" },
    { value: "piyo", label: "PIYO" },
  ],
});

const arrStrItem = arrayItem({
  name: "arr-str",
  label: "ARR",
  item: strItem,
  required: true,
  maxLength: 2,
});

const Page = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <BaseLayout title="CheckList">
      <ControlLayout>
        <ControlItem caption="readonly">
          <ToggleSwitch
            $value={readOnly}
            $onChange={v => setReadOnly(v!)}
          />
        </ControlItem>
        <ControlItem caption="disabled">
          <ToggleSwitch
            $value={disabled}
            $onChange={v => setDisabled(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <BaseSection title="data item">
          <CheckList
            $tag="str"
            $readOnly={readOnly}
            $disabled={disabled}
            $dataItem={strItem}
            $onChange={console.log}
          />
          <CheckList
            $tag="arr-str"
            $readOnly={readOnly}
            $disabled={disabled}
            $dataItem={arrStrItem}
            $onChange={console.log}
          />
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
