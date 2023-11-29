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

export const getFloatPosition = (num: number | null | undefined) => {
  if (num == null) return 0;
  const str = num.toString(10);
  if (str.indexOf(".") < 0) return 0;
  return str.length - 1 - str.lastIndexOf(".");
};