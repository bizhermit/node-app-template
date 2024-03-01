"use client";

import SelectBox from "#/client/elements/form/items/select-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import generateArray from "#/objects/array/generator";
import sleep from "#/utilities/sleep";
import BaseLayout, { BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useRef, useState } from "react";

const fetchSource = async (len: number) => {
  await sleep(3000);
  return generateArray(len, i => {
    return {
      value: i,
      label: `item-${i}`,
    };
  });
};

const Page = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const sourceLengthRef = useRef(3);

  return (
    <BaseLayout title="SelectBox">
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
        <BaseSection title="source">
          <SelectBox
            $source={async () => {
              return await fetchSource(sourceLengthRef.current++);
            }}
            $updateSourceWhenOpen
          />
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
