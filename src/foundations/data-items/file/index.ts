import { dataItemKey } from "..";

const $file = <
  C extends Omit<DataItem_File, DI.Key | "type">
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem_File, C, {
    multiple: C extends { multiple: infer Multiple } ? Multiple : false;
  }>>({
    multiple: false,
    ...(ctx as any),
    [dataItemKey]: undefined,
    type: "file",
  });
};

export default $file;
