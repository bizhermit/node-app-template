const strJoin = (joinStr: string = "", ...strs: Array<string | null | undefined>) => {
  return strs.reduce((p, v) => v ? p + joinStr + v : p, "") || undefined;
};

export default strJoin;