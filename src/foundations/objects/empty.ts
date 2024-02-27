export const isNull = (o: any | null | undefined): o is null | undefined => {
  return o == null;
};

export const isNotNull = <T = any>(o: T | null | undefined): o is Exclude<T, null | undefined> => {
  return o != null;
};

export const isEmpty = (o: any | null | undefined) => {
  if (o == null) return true;
  const t = typeof o;
  if (t === "string") return o === "";
  if (t !== "object") return false;
  switch (toString.call(o).slice(8, -1)) {
    case "Array":
      return (o as Array<any>).length === 0;
    case "Object":
      return Object.keys(o as { [v: string | number | symbol]: any }).length === 0;
    case "Map":
      return (o as unknown as Map<any, any>).size === 0;
    case "Set":
      return (o as unknown as Set<any>).size === 0;
    default: return false;
  }
};

export const isNotEmpty = <T = any>(o: T | null | undefined): o is Exclude<T, null | undefined> => {
  return !isEmpty(o);
};
