export const round = (num: number, float = 0) => {
  if (num == null) return num;
  const denom = Math.pow(10, float);
  return Math.round(num * denom) / denom;
};

export const ceil = (num: number, float = 0) => {
  if (num == null) return num;
  const denom = Math.pow(10, float);
  return Math.ceil(num * denom) / denom;
};

export const floor = (num: number, float = 0) => {
  if (num == null) return num;
  const denom = Math.pow(10, float);
  return Math.floor(num * denom) / denom;
};