const dataItem = <T extends Omit<DataItem, "$$">>(d: T): Readonly<T & { $$: any }> => {
  return Object.freeze({ ...d, $$: undefined });
};

export default dataItem;