type PickOneReturnValue<
  O extends { [v: string | number | symbol]: any } | null | undefined,
  K extends keyof Exclude<O, null | undefined>,
  RK extends string | number | symbol = K
> = O extends { [v: string | number | symbol]: any } ? (
  O[Extract<keyof O, K>] extends undefined ?
  { [P in RK]?: O[Extract<keyof O, K>] } :
  { [P in RK]: O[Extract<keyof O, K>] }
) : undefined;

export const pickOne = <
  O extends { [v: string | number | symbol]: any } | null | undefined = { [v: string | number | symbol]: any } | null | undefined,
  K extends keyof Exclude<O, null | undefined> = keyof Exclude<O, null | undefined>,
  RK extends string | number | symbol = K
>(obj: O, key: K, rename?: RK) => {
  if (!obj || !(key in obj)) return undefined as PickOneReturnValue<O, K, RK>;
  return { [rename ?? key]: obj[key] } as PickOneReturnValue<O, K, RK>;
};

type PickReturnValue<
  O extends { [v: string | number | symbol]: any } | null | undefined,
  K extends keyof Exclude<O, null | undefined>
> = O extends { [v: string | number | symbol]: any } ? Pick<O, K> : undefined;

export const pick = <
  O extends { [v: string | number | symbol]: any } | null | undefined = { [v: string | number | symbol]: any } | null | undefined,
  K extends keyof Exclude<O, null | undefined> = keyof Exclude<O, null | undefined>
>(obj: O, ...keys: Array<K>) => {
  if (!obj) return undefined as PickReturnValue<O, K>;
  const ret: { [v: string | number | symbol]: any } = {};
  keys.forEach(k => {
    if (k in obj) ret[k] = obj[k];
  });
  if (Object.keys(ret).length === 0) return undefined as PickReturnValue<O, K>;
  return ret as PickReturnValue<O, K>;
};
