import { getValue } from "../../../objects/struct/get";
import type { DataTableBaseColumn, DataTableColumn, DataTableDateColumn, DataTableNumberColumn } from "../data-table";

const dataTableDataItemColumn = <T extends Struct, D extends DataItem>(
  dataItem: DataItem & { name: string },
  props?: Partial<
    D["type"] extends DataItem_String["type"] ? DataTableBaseColumn<T> :
    D["type"] extends DataItem_Number["type"] ? DataTableNumberColumn<T> :
    D["type"] extends DataItem_Date["type"] ? DataTableDateColumn<T> :
    DataTableBaseColumn<T>
  >
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
    ...(() => {
      if ("source" in dataItem) {
        return {
          align: "left",
          body: (props) => {
            const v = props.data[dataItem.name];
            return <>{(dataItem.source as Array<Struct>).find(item => item.id === v)?.name}</>;
          },
        };
      }
      return {};
    })(),
    ...props,
  };
};

export default dataTableDataItemColumn;