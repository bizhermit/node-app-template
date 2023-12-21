const structEntries = <U extends { [v: string | number | symbol]: any }>(obj: U | null | undefined): Array<[keyof U, U[keyof U]]> => {
  return obj ? Object.keys(obj).map(k => [k, obj[k]]) : [];
};

export default structEntries;