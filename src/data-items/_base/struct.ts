import { dataItemKey } from "@/data-items/_base";

const structItem = <
  C extends Omit<DataItem_Struct, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "struct";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "struct",
  });
};

export default structItem;