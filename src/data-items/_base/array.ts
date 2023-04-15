import { dataItemKey } from "@/data-items/_base";

const arrayItem = <
  C extends Omit<DataItem_Array, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & Readonly<{
    [dataItemKey]: undefined;
    type: "array";
  }>>({ ...(ctx as any), [dataItemKey]: undefined, type: "array" });
};

export default arrayItem;