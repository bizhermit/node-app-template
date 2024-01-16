type HV = { [v: string | number | symbol]: any };

const clone = <T = any>(o: T): T => {
  if (o == null || typeof o !== "object") return o;
  switch (toString.call(o).slice(8, -1)) {
    case "Array":
      return (o as Array<any>).map(v => clone(v)) as T;
    case "Object":
      const r: HV = {};
      Object.entries(o).forEach(([k, v]) => r[k] = clone(v));
      return r as T;
    case "Date":
      return new Date((o as unknown as Date).getTime()) as T;
    case "Map":
      return new Map([...o as any].map(v => [clone(v[0]), clone(v[1])])) as T;
    case "Set":
      return new Set([...o as any].map(v => clone(v))) as T;
    case "RegExp":
      return RegExp((o as unknown as RegExp).source, (o as unknown as RegExp).flags) as T;
    default: return o;
  }
};

export default clone;
