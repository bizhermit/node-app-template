import { dataItemKey } from "..";

const stringItem = <
  V extends string,
  C extends Omit<DataItem_String<V>, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: V;
    type: "string";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "string",
  });
};

export default stringItem;