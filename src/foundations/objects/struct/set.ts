export const setValue = <U = any>(data: { [v: string | number | symbol]: any } | null | undefined, name: string, value: U) => {
  if (data == null) return value;
  const names = name.split(".");
  let v: any = data;
  for (const n of names.slice(0, names.length - 1)) {
    try {
      if (v[n] == null) v[n] = {};
      v = v[n];
    } catch {
      return value;
    }
  }
  try {
    v[names[names.length - 1]] = value;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return value;
};
