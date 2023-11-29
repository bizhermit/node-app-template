export const getValue = <U = any>(data: { [v: string | number | symbol]: any } | null | undefined, name: string): U | null | undefined => {
  if (data == null) return undefined;
  const names = name.split(".");
  let v: any = data;
  for (const n of names) {
    if (v == null) return undefined;
    try {
      v = v[n];
    } catch {
      return undefined;
    }
  }
  return v as U;
};