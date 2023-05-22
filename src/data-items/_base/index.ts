export const dataItemKey: DataItemKey = "$$";

const dataItem = <
  C extends Omit<DataItem, DataItemKey>
>(ctx?: C) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
  });
};

export default dataItem;