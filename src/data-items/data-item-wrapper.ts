const dataItem = <T extends DataItem>(d: T): Readonly<T> => {
  return Object.freeze(d);
};

export default dataItem;