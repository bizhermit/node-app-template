import Button from "@/components/elements/button";
import DataTable, { DataTableColumn } from "@/components/elements/data-table";
import Row from "@/components/elements/row";
import ArrayUtils from "@bizhermit/basic-utils/dist/array-utils";
import { NextPage } from "next";
import { useMemo, useState } from "react";

type Data = {
  id: number;
  col1?: string;
};

const Page: NextPage = () => {
  const columns = useMemo(() => {
    const cols: Array<DataTableColumn<Data>> = [];
    cols.push(
      {
        name: "col1",
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
        $emptyText
      />
    </div>
  );
};

export default Page;