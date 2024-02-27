/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import DataTable, { DataTableCellLabel, DataTableColumn, DataTableProps, dataTableRowNumberColumn } from "#/client/elements/data-table";
import dataTableButtonColumn from "#/client/elements/data-table/button";
import dataTableCheckBoxColumn from "#/client/elements/data-table/check-box";
import NumberBox from "#/client/elements/form/items/number-box";
import SelectBox from "#/client/elements/form/items/select-box";
import ToggleSwitch from "#/client/elements/form/items/toggle-switch";
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
};

const Page = () => {
  const columns = useMemo(() => {
    const cols: Array<DataTableColumn<Data>> = [];
    cols.push(
      dataTableRowNumberColumn,
      dataTableCheckBoxColumn({
        name: "selected",
        bulk: true,
        sticky: true,
      }),
      dataTableButtonColumn({
        name: "button",
        // buttonText: "button",
        $round: true,
        $outline: true,
        width: "9rem",
        resize: true,
        // padding: false,
        onClick: (ctx) => {
          console.log(ctx);
        },
      }),
      {
        name: "col1",
        label: "Col1",
        width: 120,
        sort: true,
        resize: false,
        sortNeutral: false,
        sticky: true,
        link: (ctx) => {
          return {
            pathname: "/sandbox/elements/data-table",
            query: { id: ctx.data.id },
          };
        },
        // wrap: true,
      },
      {
        name: "group",
        label: "Group",
        rows: [
          [],
          [
            {
              name: "col2",
              label: "Col2",
              align: "left",
              width: 200,
              wrap: true,
            },
            {
              name: "col3",
              label: "Col3",
              align: "center",
            },
            {
              name: "col4",
              label: "Col4",
              align: "right",
            },
          ]
        ]
      },
      {
        name: "col5",
        label: "Col5",
        align: "center",
        // minWidth: "30rem",
        sort: true,
        header: (props) => {
          console.log(props);
          return (
            <div>custom header</div>
          );
        },
        body: (props) => {
          return (
            <DataTableCellLabel>
              custom cell: {props.data.col5}
            </DataTableCellLabel>
          );
        },
      },
      {
        name: "number",
        label: "Number",
        type: "number",
        sort: true,
        width: 120,
        border: true,
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        sort: true,
        width: 120,
        border: false,
      }
    );
    return cols;
  }, []);

  const [items, setItems] = useState<Array<Data>>(null!);

  const generateItems = (length = 0) => {
    setItems(generateArray(length, index => {
      return {
        id: index,
        col1: `col1 - ${index}`,
        col2: `col2 - ${index}`,
        col3: `col3 - ${index}`,
        col4: `col4 - ${index}`,
        col5: `col5 - ${index}`,
        number: index * 1000,
        date: `2023-01-${1 + index}`,
        button: `button${index}`,
      } as Data;
    }));
  };

  const [outline, setOutline] = useState<boolean>();
  const [rowBorder, setRowBorder] = useState<boolean>();
  const [cellBorder, setCellBorder] = useState<boolean>();
  const [scroll, setScroll] = useState<boolean>(true);
  const [page, setPage] = useState<boolean>();
  const [perPage, setPerPage] = useState(10);
  const [dragScroll, setDragScroll] = useState<DataTableProps["$dragScroll"]>();
  const [radio, setRadio] = useState<boolean>();
  const [stripes, setStripes] = useState<boolean>();
  const [multiSort, setMultiSort] = useState<boolean>();

  return (
    <BaseLayout
      title="DataTable"
      scroll={scroll}
    >
      <ControlLayout>
        <ControlItem caption="outline">
          <ToggleSwitch
            $value={outline}
            $onChange={v => setOutline(v!)}
          />
        </ControlItem>
        <ControlItem caption="row border">
          <ToggleSwitch
            $value={rowBorder}
            $onChange={v => setRowBorder(v!)}
          />
        </ControlItem>
        <ControlItem caption="cell border">
          <ToggleSwitch
            $value={cellBorder}
            $onChange={v => setCellBorder(v!)}
          />
        </ControlItem>
        <ControlItem caption="radio">
          <ToggleSwitch
            $value={radio}
            $onChange={v => setRadio(v!)}
          />
        </ControlItem>
        <ControlItem caption="stripes">
          <ToggleSwitch
            $value={stripes}
            $onChange={v => setStripes(v!)}
          />
        </ControlItem>
        <ControlItem caption="multi sort">
          <ToggleSwitch
            $value={multiSort}
            $onChange={v => setMultiSort(v!)}
          />
        </ControlItem>
        <ControlItem caption="scroll">
          <ToggleSwitch
            $value={scroll}
            $onChange={v => setScroll(v!)}
          />
        </ControlItem>
        <ControlItem caption="page">
          <BaseRow>
            <ToggleSwitch
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
        <ControlItem caption="drag scroll">
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
        </ControlItem>
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
      <DataTable<Data>
        style={{
          width: "100%",
          flex: scroll ? "1 1 0rem" : undefined,
        }}
        $columns={columns}
        $value={items}
        $header
        $emptyText
        $headerHeight="6rem"
        $rowHeight="3.6rem"
        $multiSort={multiSort}
        $scroll={scroll}
        $outline={outline}
        $rowBorder={rowBorder}
        $cellBorder={cellBorder}
        $page={page}
        $perPage={perPage}
        $onChangePage={(index) => {
          console.log(index);
          return true;
        }}
        $onClick={(ctx, elem) => {
          console.log(ctx, elem);
        }}
        $radio={radio}
        $stripes={stripes}
        // $rowPointer
        $dragScroll={dragScroll}
      />
    </BaseLayout>
  );
};

export default Page;
