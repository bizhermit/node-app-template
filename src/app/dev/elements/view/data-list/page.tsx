/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import DataList from "#/client/elements/data-list";
import { DataListColumn } from "#/client/elements/data-list/class";
import NumberBox from "#/client/elements/form/items/number-box";
import SelectBox from "#/client/elements/form/items/select-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { ResizeDirection } from "#/client/elements/resizer";
import generateArray from "#/objects/array/generator";
import { useMemo, useState } from "react";
import BaseLayout, { BaseRow } from "../../../_components/base-layout";
import ControlLayout, { ControlItem } from "../../../_components/control-layout";

type Data = {
  id: number;
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
  string: string;
  number: number;
  date: string;
};

const generateDataArray = (length = 0) => {
  return generateArray(length, index => {
    return {
      id: index,
      string: `data ${index}`,
      number: index * 1000,
      date: `2023-01-${1 + index}`,
      button: `button${index}`,
    } as Data;
  });
};

const Page = () => {
  const columns = useMemo(() => {
    const cols: Array<DataListColumn<Data>> = [];
    cols.push(
      {
        name: "string",
        label: "String",
      },
      {
        name: "number",
        dataType: "number",
        label: "Number",
        // align: "left",
        // fill: true,
      },
      {
        name: "date",
        dataType: "date",
        label: "Date",
        width: 120,
        align: "center",
        // border: false,
      },
      {
        name: "multi",
        rows: [{
          columns: [
            {
              name: "multi-string",
              displayName: "string",
              label: "String",
            },
            {
              name: "multi-number",
              displayName: "number",
              label: "Number",
              dataType: "number",
            },
          ],
        }, {
          columns: [
            {
              name: "multi-date",
              displayName: "date",
              label: "Date",
              dataType: "date",
            },
          ],
        }],
      },
      {
        name: "group",
        rows: [{
          columns: [
            {
              name: "group-caption",
              label: "Group",
            }
          ],
          body: false,
        }, {
          columns: [
            {
              name: "group-string",
              displayName: "string",
              label: "String",
            },
            {
              name: "group-number",
              displayName: "number",
              label: "Number",
              dataType: "number",
            },
          ],
        }],
      },
    );
    return cols;
  }, []);

  const [items, setItems] = useState<Array<Data>>(null!);

  const generateItems = (length = 0) => {
    setItems(generateDataArray(length));
  };

  const [outline, setOutline] = useState<boolean>();
  const [rowBorder, setRowBorder] = useState<boolean>();
  const [cellBorder, setCellBorder] = useState<boolean>();
  const [scroll, setScroll] = useState<boolean>(true);
  const [page, setPage] = useState<boolean>();
  const [perPage, setPerPage] = useState(10);
  // const [dragScroll, setDragScroll] = useState<DataListProps["$dragScroll"]>();
  const [radio, setRadio] = useState<boolean>();
  const [stripes, setStripes] = useState<boolean>();
  const [multiSort, setMultiSort] = useState<boolean>();
  const [resize, setResize] = useState<ResizeDirection>();

  return (
    <BaseLayout
      title="DataList"
      scroll={scroll}
    >
      <ControlLayout>
        <ControlItem caption="outline">
          <ToggleBox
            $value={outline}
            $onChange={v => setOutline(v!)}
          />
        </ControlItem>
        <ControlItem caption="row border">
          <ToggleBox
            $value={rowBorder}
            $onChange={v => setRowBorder(v!)}
          />
        </ControlItem>
        <ControlItem caption="cell border">
          <ToggleBox
            $value={cellBorder}
            $onChange={v => setCellBorder(v!)}
          />
        </ControlItem>
        <ControlItem caption="radio">
          <ToggleBox
            $value={radio}
            $onChange={v => setRadio(v!)}
          />
        </ControlItem>
        <ControlItem caption="stripes">
          <ToggleBox
            $value={stripes}
            $onChange={v => setStripes(v!)}
          />
        </ControlItem>
        <ControlItem caption="multi sort">
          <ToggleBox
            $value={multiSort}
            $onChange={v => setMultiSort(v!)}
          />
        </ControlItem>
        <ControlItem caption="scroll">
          <ToggleBox
            $value={scroll}
            $onChange={v => setScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="resize">
          <SelectBox
            style={{ width: "12rem" }}
            $value={resize}
            $onChange={v => setResize(v!)}
            $source={[
              { value: "x", label: "x" },
              { value: "y", label: "y" },
              { value: "xy", label: "xy" },
            ]}
          />
        </ControlItem>
        <ControlItem caption="page">
          <BaseRow>
            <ToggleBox
              $value={page}
              $onChange={v => setPage(v!)}
            />
            <NumberBox
              $value={perPage}
              $onChange={v => setPerPage(v ?? 20)}
              $min={1}
              $max={100}
              $width={100}
              $hideClearButton
            />
          </BaseRow>
        </ControlItem>
        {/* <ControlItem caption="drag scroll">
          <SelectBox
            style={{ width: "25rem" }}
            placeholder="drag scroll"
            $source={[
              { value: true, label: "drag scroll" },
              { value: false, label: "no drag scroll" },
              { value: "vertical", label: "drag vertical scroll" },
              { value: "horizontal", label: "drag horizontal scroll" },
            ]}
            $value={dragScroll as any}
            $onChange={
              v => setDragScroll((() => {
                if (v === "true") return true;
                if (v === "false") return false;
                return v;
              }))
            }
          />
        </ControlItem> */}
        <ControlItem caption="set value">
          <BaseRow>
            <Button $size="s" $fitContent onClick={() => setItems(null!)}>null</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(0)}>0</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(1)}>1</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(10)}>10</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(50)}>50</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(99)}>99</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(100)}>100</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(101)}>101</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(1000)}>1000</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(10000)}>10000</Button>
            <Button $size="s" $fitContent onClick={() => generateItems(100000)}>100000</Button>
            <Button $size="s" $fitContent onClick={() => console.log(items)}>console.log</Button>
          </BaseRow>
        </ControlItem>
      </ControlLayout>
      <DataList
        style={{
          width: "100%",
          flex: scroll ? "1 1 0rem" : undefined,
        }}
        $columns={columns}
        $value={items}
        $resize={resize}
        $outline={outline}
        $rowBorder={rowBorder}
        $cellBorder={cellBorder}
        $headerHeight={60}
        $footerHeight={60}
        $rowHeight={60}
      />
    </BaseLayout>
  );
};

export default Page;