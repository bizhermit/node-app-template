import { dataItemKey } from "@/data-items/data-item";

const structItem = <C extends Omit<DataItem_Struct, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Struct : C & DataItem_Struct> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "struct" });
};

export default structItem;