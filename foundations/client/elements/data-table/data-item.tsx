import type { DataTableBaseColumn, DataTableColumn } from "#/client/elements/data-table";
import { getValue } from "#/data-items/utilities";

const dataTableDataItemColumn = <T extends Struct>(
  dataItem: DataItem & { name: string },
  props?: Partial<DataTableBaseColumn<T>>
): DataTableColumn<T> => {
  return {
    name: dataItem.name,
    label: dataItem.label,
    ...(() => {
      switch (dataItem.type) {
        case "string":
          return {
            type: "label",
            width: dataItem.width,
            minWidth: dataItem.minWidth,
            maxWidth: dataItem.maxWidth,
          };
        case "number":
          return {
            type: "number",
            width: dataItem.width,
            minWidth: dataItem.minWidth,
            maxWidth: dataItem.maxWidth,
          };
        case "date":
          return {
            type: "date",
          };
        case "boolean":
          return {
            align: "center",
            width: "6rem",
            body: ({ data }) => {
              const v = getValue(data, dataItem.name);
              return <>{v === dataItem.trueValue ? "○" : ""}</>;
            }
          };
        default:
          return {
            type: "label",
          };
      }
    })(),
    ...props,
  };
};

export default dataTableDataItemColumn;