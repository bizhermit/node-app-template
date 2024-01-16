"use client";

import Card from "#/client/elements/card";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import StructView, { type StructKey } from "#/client/elements/struct-view";
import generateArray from "#/objects/array/generator";
import { useMemo, useState } from "react";
import BaseLayout, { BaseRow, BaseSheet } from "../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../_components/control-layout";

const Page = () => {
  const [outline, setOutline] = useState(true);

  const struct = useMemo(() => {
    const ret: Struct = {};
    generateArray(10, index => {
      ret[`item${index}`] = `value ${index}`;
    });
    ret.left = "left";
    ret.center = "center";
    ret.right = "right";
    ret.text = "123456789012345678901234567890";
    ret.number = 1234567890;
    ret.date = new Date();
    ret.struct = {
      hoge: "Hoge",
      fuga: "Fuga",
      piyo: "Piyo!"
    };
    return ret;
  }, []);

  const keys = useMemo<Array<StructKey>>(() => {
    return [
      {
        key: "item1",
        label: "項目１",
      },
      {
        key: "item3",
        label: "項目３",
        align: "right",
      },
      {
        key: "item5",
        label: "項目５",
      },
      {
        key: "item7",
        label: "項目７",
      },
      {
        key: "left",
        label: "align left",
        align: "left",
      },
      {
        key: "center",
        label: "align left",
        align: "center",
      },
      {
        key: "right",
        label: "align left",
        align: "right",
      },
      {
        key: "text",
        label: "文字列",
      },
      {
        key: "number",
        label: "数値",
      },
      {
        key: "date",
        label: "日付",
      },
      {
        key: "struct",
        label: "Struct"
      },
      {
        key: "empty",
        label: "Empty",
      },
    ];
  }, []);

  return (
    <BaseLayout title="StructView">
      <ControlLayout>
        <ControlItem caption="outline">
          <ToggleBox
            $value={outline}
            $onChange={v => setOutline(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <BaseRow>
          <StructView
            style={{
              minWidth: 350,
            }}
            $keys={keys}
            $value={struct}
            $outline={outline}
          />
          <Card
            style={{
              minWidth: 400,
            }}
            $color="sub"
            $accordion
            $header="StructView (auto keys)"
          >
            <div
              style={{
                padding: "var(--b-s)",
              }}
            >
              <StructView
                $color="sub-light"
                $value={struct}
                $outline={outline}
              />
            </div>
          </Card>
        </BaseRow>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;