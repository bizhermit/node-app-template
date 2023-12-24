/* eslint-disable no-console */
"use client";

import CheckList from "#/client/elements/form/items/check-list";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import arrayItem from "#/data-items/array";
import stringItem from "#/data-items/string";
import BaseLayout, { BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const strItem = stringItem({
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
      </ControlLayout>
      <BaseSheet>
        <BaseSection title="data item">
          <CheckList
            $tag="str"
            $dataItem={strItem}
            $onChange={console.log}
          />
          <CheckList
            $tag="arr-str"
            $dataItem={arrStrItem}
            $onChange={console.log}
          />
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;