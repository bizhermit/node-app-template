type JoinedString<T extends string | null | undefined> = Exclude<T, null> extends undefined ? undefined : string;

const strJoin = <
  T extends string | null | undefined = string | null | undefined
>(joinStr: string = "", ...strs: Array<T>) => {
  return strs.reduce((p, v) => v ? (p || "") + (p ? joinStr : "") + v : p, undefined as string | undefined) as JoinedString<T>;
};

export default strJoin;