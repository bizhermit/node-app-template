"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import DateBox from "#/client/elements/form/items/date-box";
import SelectBox from "#/client/elements/form/items/select-box";
import TextBox from "#/client/elements/form/items/text-box";
import Popup from "#/client/elements/popup";
import generateArray from "#/objects/array/generator";
import { FC, useRef, useState } from "react";
import BaseLayout, { BaseRow, BaseSection, BaseSheet } from "../../_components/base-layout";

const Component: FC = () => {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  return (
    <BaseSheet>
      <Button
        ref={anchorRef}
        onClick={() => {
          setShow(true);
        }}
      >
        show
      </Button>
      <Popup
        $show={show}
        $onToggle={(v) => {
          setShow(v);
        }}
        $mask
        $closeWhenClick
        $preventClickEvent
        $anchor={anchorRef}
        $position={{
          x: "inner",
          y: "outer",
          // absolute: true,
        }}
      // $animationDirection="horizontal"
      // $animationDirection="vertical"
      >
        <BaseSection>
          <Form
            $layout="flex"
            action="/api/form"
            method="get"
          >
            <TextBox name="text" style={{ width: 300 }} />
            <SelectBox
              name="select"
              $source={generateArray(10, (idx) => {
                return {
                  value: idx,
                  label: `item${idx}`,
                };
              })}
            />
            <DateBox
              name="date"
            />
            <BaseRow>
              <Button type="submit">submit</Button>
              <Button
                onClick={() => {
                  setShow(false);
                }}
              >
                close
              </Button>
            </BaseRow>
          </Form>
          <Component />
        </BaseSection>
      </Popup>
    </BaseSheet>
  );
};

const Page = () => {
  return (
    <BaseLayout title="Popup">
      <BaseSheet>
        <Component />
        <div
          style={{
            height: "150vh",
            width: "100%",
            position: "relative",
            boxSizing: "border-box",
            // height: "10rem",
            // height: "100%",
            // width: "150vw",
            // width: "10rem",
            // width: "100%",
            background: "linear-gradient(-225deg, var(--c-main) 0%, var(--c-sub) 100%)",
            color: "var(--c-main_)",
            padding: "var(--b-m)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "fixed",
              zIndex: 1000000,
            }}
          >
            hoge
          </div>
        </div>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
