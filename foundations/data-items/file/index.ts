import { dataItemKey } from "..";

const fileItem = <
  C extends Omit<DataItem_File, DataItemKey | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
    type: "file";
    multiple: C extends { multiple: infer Multiple } ? Multiple : false;
  }>({
    multiple: false,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "file",
  });
};

export default fileItem;