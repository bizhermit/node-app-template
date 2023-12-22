import { dataItemKey } from "..";

const structItem = <
  C extends Omit<DataItem_Struct, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_Struct, C>>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "struct",
  });
};

export default structItem;