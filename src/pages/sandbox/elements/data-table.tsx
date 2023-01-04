import DataTable, { DataTableColumn } from "@/components/elements/data-table";
import { NextPage } from "next";
import { useMemo } from "react";

const Page: NextPage = () => {
  const columns = useMemo(() => {
    const cols: Array<DataTableColumn> = [];
    cols.push(
      {
        name: "col1",
      }
    );
    return cols;
  }, []);

  return (
    <div className="flex-start w-100 p-1">
      <DataTable
        columns={columns}
      />
    </div>
  );
};

export default Page;