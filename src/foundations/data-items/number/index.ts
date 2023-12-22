import { dataItemKey } from "..";

const numberItem = <
  V extends number,
  C extends Omit<DataItem_Number<V>, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_Number, C>>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "number",
  });
};

export default numberItem;