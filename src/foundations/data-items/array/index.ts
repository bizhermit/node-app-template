import { dataItemKey } from "..";

const $arr = <
  C extends Omit<DataItem_Array, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_Array, C>>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "array",
  });
};

export default $arr;