"use client";

import Badge from "#/client/elements/badge";
import Button from "#/client/elements/button";
import RadioButtons from "#/client/elements/form/items/radio-buttons";
import { sizes } from "#/utilities/sandbox";
import { useState } from "react";
import BaseLayout, { BaseRow, BaseSheet } from "../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../_components/control-layout";

const Page = () => {
  const [count, setCount] = useState(99);
  const [size, setSize] = useState<Size>("m");

  return (
    <BaseLayout title="Badge">
      <ControlLayout>
        <ControlItem caption="size">
          <RadioButtons
            $source={sizes.map(size => {
              return { value: size, label: size };
            })}
            $value={size}
            $onChange={v => setSize(v!)}
          />
        </ControlItem>
        <ControlItem caption="content">
          <BaseRow>
            <Button $fitContent onClick={() => setCount(c => c + 1)}>count up</Button>
            <Button $fitContent onClick={() => setCount(0)} $outline>reset</Button>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <style jsx>{`
          .anchor {
            position: relative;
            height: 20rem;
            width: 20rem;
            background: var(--c-sub);
          }
        `}</style>
        <BaseRow>
          <div className="anchor c-primary">
            <Badge
              $position="left-top"
              $size={size}
              // $color="main"
              $round
            >
              {count}
            </Badge>
          </div>
          <div className="anchor c-primary">
            <Badge
              $position="right-top"
              $size={size}
              $color="primary"
              $round
            >
              {count}
            </Badge>
          </div>
        </BaseRow>
        <BaseRow>
          <div className="anchor c-primary">
            <Badge
              $position="left-bottom"
              $size={size}
              $color="secondary"
              $round
            >
              {count}
            </Badge>
          </div>
          <div className="anchor c-primary">
            <Badge
              $position="right-bottom"
              $size={size}
              $color="main"
            >
              {count}
            </Badge>
          </div>
        </BaseRow>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;