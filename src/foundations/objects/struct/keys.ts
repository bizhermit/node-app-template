const structKeys = <U extends { [v: string | number | symbol]: any }>(obj: U | null | undefined): Array<keyof U> => {
  return obj ? Object.keys(obj) : [];
};

export default structKeys;
