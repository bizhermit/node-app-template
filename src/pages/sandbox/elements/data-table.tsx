import Button from "@/components/elements/button";
import DataTable, { DataTableColumn, dataTableRowNumberColumn } from "@/components/elements/data-table";
import Row from "@/components/elements/row";
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
      {
        name: "col1",
        label: "Col1",
        width: 120,
        resize: true,
        sort: true,
        href: (ctx) => {
          return `/sandbox/elements/data-table?id=${ctx.data.id}`;
        },
        hrefOptions: {
          rel: ""
        },
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
              resize: true,
              width: 200,
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
        sort: true,
        header: (props) => {
          return (
            <div className="mx-auto">custom header</div>
          );
        },
        body: (props) => {
          return (
            <div>custom cell: {props.data.col5}</div>
          );
        },
      },
      {
        name: "number",
        label: "Number",
        type: "number",
        sort: true,
        width: 120,
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        sort: true,
        width: 120,
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
        date: `2023-01-${1 + index}`
      } as Data;
    }));
  };

  return (
    <div className="flex-start w-100 h-100 gap-1 p-1">
      <Row className="gap-1">
        <Button $fitContent $onClick={() => setItems(null!)}>null</Button>
        <Button $fitContent $onClick={() => generateItems(0)}>0</Button>
        <Button $fitContent $onClick={() => generateItems(1)}>1</Button>
        <Button $fitContent $onClick={() => generateItems(10)}>10</Button>
        <Button $fitContent $onClick={() => generateItems(50)}>50</Button>
        <Button $fitContent $onClick={() => generateItems(100)}>100</Button>
      </Row>
      <DataTable<Data>
        className="w-100 flex-1"
        $columns={columns}
        $value={items}
        $header
        $emptyText
        $headerHeight="6rem"
        $rowHeight="3.6rem"
        $multiSort
        $scroll
      />
    </div>
  );
};

export default Page;