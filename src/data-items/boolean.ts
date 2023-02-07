import { dataItemKey } from "@/data-items/data-item";

const booleanItem = <C extends Omit<DataItem_Boolean, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Boolean : C & DataItem_Boolean> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "boolean" });
};

export default booleanItem;