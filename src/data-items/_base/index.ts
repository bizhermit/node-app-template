export const dataItemKey: DataItemKey = "$$";

const dataItem = <C extends Omit<DataItem, DataItemKey>>(ctx?: C): Readonly<C extends (undefined | null) ? DataItem : C & DataItem> => {
  return Object.freeze({ ...(ctx as any), [dataItemKey]: undefined });
};

export default dataItem;