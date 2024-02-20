import { dataItemKey } from "..";

const $str = <
  V extends string,
  C extends Omit<DataItem_String<V>, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_String, C>>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "string",
  });
};

export default $str;
