import Button from "@/components/elements/button";
import DataTable, { DataTableCellLabel, DataTableColumn, dataTableRowNumberColumn } from "@/components/elements/data-table";
import dataTableButtonColumn from "@/components/elements/data-table/button";
import dataTableCheckBoxColumn from "@/components/elements/data-table/check-box";
import NumberBox from "@/components/elements/form-items/number-box";
import ToggleBox from "@/components/elements/form-items/toggle-box";
import Row from "@/components/elements/row";
import { joinClassNames } from "@/components/utilities/attributes";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useMemo, useState } from "react";

type Data = {
  id: number;
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
};

const Page: NextPage = () => {
  const columns = useMemo(() => {
    const cols: Array<DataTableColumn<Data>> = [];
    cols.push(
      dataTableRowNumberColumn,
      dataTableCheckBoxColumn({
        name: "selected",
        bulkCheck: true,
      }),
      dataTableButtonColumn({
        name: "button",
        // buttonText: "button",
        round: true,
        outline: true,
        width: "9rem",
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
        href: (ctx) => {
          return `/sandbox/elements/data-table?id=${ctx.data.id}`;
        },
        hrefOptions: {
          rel: ""
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
          return (
            <div className="mx-auto">custom header</div>
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
    setItems(ArrayUtils.generateArray(length, index => {
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

  const [outline, setOutline] = useState(true);
  const [rowBorder, setRowBorder] = useState(true);
  const [cellBorder, setCellBorder] = useState(true);
  const [scroll, setScroll] = useState(true);
  const [page, setPage] = useState(false);
  const [perPage, setPerPage] = useState(10);

  return (
    <div className="flex-start w-100 h-100 gap-1 p-1">
      <Row className="gap-1">
        <Row className="gap-1">
          <Button $size="s" $fitContent $onClick={() => setItems(null!)}>null</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(0)}>0</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(1)}>1</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(10)}>10</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(50)}>50</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(99)}>99</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(100)}>100</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(101)}>101</Button>
          <Button $size="s" $fitContent $onClick={() => generateItems(1000)}>1000</Button>
          <Button $size="s" $fitContent $onClick={() => console.log(items)}>console.log</Button>
        </Row>
        <Row className="gap-1">
          <ToggleBox $value={outline} $onChange={v => setOutline(v!)}>outline</ToggleBox>
          <ToggleBox $value={rowBorder} $onChange={v => setRowBorder(v!)}>row border</ToggleBox>
          <ToggleBox $value={cellBorder} $onChange={v => setCellBorder(v!)}>cell border</ToggleBox>
          <ToggleBox $value={scroll} $onChange={v => setScroll(v!)}>scroll</ToggleBox>
          <ToggleBox $value={page} $onChange={v => setPage(v!)}>page</ToggleBox>
          <NumberBox $value={perPage} $onChange={v => setPerPage(v ?? 20)} $min={1} $max={100} $width={100} $hideClearButton />
        </Row>
      </Row>
      <DataTable<Data>
        className={joinClassNames("w-100", scroll ? "flex-1" : undefined)}
        $columns={columns}
        $value={items}
        $header
        $emptyText
        $headerHeight="6rem"
        $rowHeight="3.6rem"
        $multiSort
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
      />
    </div>
  );
};

export default Page;