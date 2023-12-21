import { dataItemKey } from "..";

const numberItem = <
  V extends number,
  C extends Omit<DataItem_Number<V>, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: V;
    type: "number";
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "number",
  });
};

export default numberItem;