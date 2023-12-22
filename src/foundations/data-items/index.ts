export const dataItemKey: DI.Key = "$$";

const dataItem = <
  C extends Omit<DataItem, DI.Key>
>(ctx?: Readonly<C>) => {
  return Object.freeze<DI.Freeze<DataItem, C>>({
    ...(ctx as any),
    [dataItemKey]: undefined,
  });
};

export default dataItem;