export const dataItemKey: DataItemKey = "$$";

const dataItem = <
  C extends Omit<DataItem, DataItemKey>
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & Readonly<{
    [dataItemKey]: undefined;
  }>>({ ...(ctx as any), [dataItemKey]: undefined });
};

export default dataItem;