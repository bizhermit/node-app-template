import React, { FunctionComponent, HTMLAttributes, ReactElement, useRef } from "react";
import Style from "$/components/elements/data-table.module.scss";
import { attributes } from "@/components/utilities/attributes";

export type DataTableColumn = {
  name: string;
};

type OmitAttributes = "children";
export type DataTableProps<T extends Struct = Struct> = Omit<HTMLAttributes<HTMLDivElement>, OmitAttributes> & {
  $columns: Array<DataTableColumn>;
  $value: Array<T>;
};

interface DataTableFC extends FunctionComponent<DataTableProps> {
 <T extends Struct = Struct>(attrs: DataTableProps<T>, ref?: React.ForwardedRef<HTMLDivElement>): ReactElement<any> | null;
}

const DataTable: DataTableFC = React.forwardRef<HTMLDivElement, DataTableProps>(<T extends Struct = Struct>(props: DataTableProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
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