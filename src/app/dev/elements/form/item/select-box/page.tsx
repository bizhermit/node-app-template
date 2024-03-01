"use client";

import SelectBox from "#/client/elements/form/items/select-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
import generateArray from "#/objects/array/generator";
import sleep from "#/utilities/sleep";
import BaseLayout, { BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useRef, useState } from "react";

const generateSource = (len: number, rev?: string | number) => {
  return generateArray(len, i => {
    return {
      value: i,
      label: `item-${i}${rev == null ? "" : ` (${rev})`}`,
    };
  });
};

const fetchSource = async (len: number, rev?: string | number) => {
  await sleep(3000);
  return generateSource(len, rev);
};

const Page = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const sourceLengthRef = useRef(0);

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
          <h3>array</h3>
          <SelectBox
            $source={[
              { value: 0, label: `item-0` },
              { value: 1, label: `item-1` },
              { value: 2, label: `item-2` },
            ]}
          />
          <h3>func</h3>
          <SelectBox
            $source={() => generateSource(10)}
          />
          <h3>await func</h3>
          <SelectBox
            $source={() => fetchSource(10)}
          />
          <h3>await func / reload when open</h3>
          <SelectBox
            $source={async () => {
              if (sourceLengthRef.current > 50) {
                sourceLengthRef.current = 0;
              }
              return await fetchSource(sourceLengthRef.current += 7, sourceLengthRef.current);
            }}
            $reloadSourceWhenOpen
          />
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
