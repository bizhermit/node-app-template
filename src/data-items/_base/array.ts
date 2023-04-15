import { dataItemKey } from "@/data-items/_base";

const arrayItem = <C extends Omit<DataItem_Array, DataItemKey | "type">>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem_Array : C & DataItem_Array> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined, type: "array" });
};

export default arrayItem;