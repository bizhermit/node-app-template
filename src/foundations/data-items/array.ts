import { dataItemKey } from ".";

const arrayItem = <
  C extends Omit<DataItem_Array, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "array";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "array",
  });
};

export default arrayItem;