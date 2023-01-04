import React, { HTMLAttributes } from "react";
import Style from "$/components/elements/data-table.module.scss";
import { attributes } from "@/components/utilities/attributes";

export type DataTableColumn = {
  name: string;
};

type OmitAttributes = "children";
export type DataTableProps = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  columns: Array<DataTableColumn>;
};

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>((props, ref) => {
  return (
    <div
      {...attributes(props, Style.wrap)}
      ref={ref}
    >
      data table
    </div>
  );
});

export default DataTable;