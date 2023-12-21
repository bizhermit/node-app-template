export const dataItemKey: DI.Key = "$$";

const dataItem = <
  C extends Omit<DataItem, DI.Key>
>(ctx?: Readonly<C>) => {
  return Object.freeze<C & {
    [dataItemKey]: undefined;
  }>({
    ...(ctx as any),
    [dataItemKey]: undefined,
  });
};

export default dataItem;