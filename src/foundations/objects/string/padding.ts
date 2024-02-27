export const padLeft = (str: string | null | undefined, len: number, padStr = " ") => {
  const v = str || "";
  if (v.length > len) return v;
  return (padStr.repeat(len) + v).slice(-len);
};

export const padRight = (str: string | null | undefined, len: number, padStr = " ") => {
  const v = str || "";
  if (v.length > len) return v;
  return (v + padStr.repeat(len)).substring(0, len);
};
