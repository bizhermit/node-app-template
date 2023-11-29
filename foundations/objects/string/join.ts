const strJoin = (joinStr: string = "", ...strs: Array<string | null | undefined>) => {
  return strs.reduce((p, v) => p + joinStr + v, "") || undefined;
};

export default strJoin;