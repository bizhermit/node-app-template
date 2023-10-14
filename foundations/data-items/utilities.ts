export const getValue = <T extends Struct = Struct, U = any>(data: T | null | undefined, name: string): U => {
  if (data == null) return undefined as any;
  const names = name.split(".");
  let v: any = data;
  for (const n of names) {
    if (v == null) return undefined as any;
    try {
      v = v[n];
    } catch {
      return undefined as any;
    }
  }
  return v;
};

export const setValue = <T extends Struct = Struct, U = any>(data: T | null | undefined, name: string, value: U): U => {
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

export const equals = (v1: unknown, v2: unknown) => {
  if (v1 == null && v2 == null) return true;
  return v1 === v2;
};