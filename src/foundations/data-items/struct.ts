import { dataItemKey } from ".";

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

export const structKeys = <
  U extends { [key: string | number | symbol]: any }
>(struct: U | null | undefined): Array<keyof U> => {
  return struct ? Object.keys(struct) : [];
};

export const withoutNullValueStruct = <
  U extends { [key: string | number | symbol]: any }
>(struct: U | null | undefined) => {
  const ret = { ...struct };
  structKeys(struct).forEach(key => {
    if (ret[key] != null) return;
    delete ret[key];
  });
  return ret as Partial<U>;
};

export default structItem;