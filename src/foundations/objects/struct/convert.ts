export const nonNullStruct = <U extends { [v: string | number | symbol]: any }>(obj: U | null | undefined) => {
  if (obj == null) return undefined;
  const ret: { [v: string | number | symbol]: any } = {};
  Object.keys(obj).forEach(k => {
    const v = obj[k];
    if (v == null) return;
    ret[k] = v;
  });
  if (Object.keys(ret).length === 0) return undefined;
  return ret as U;
};
