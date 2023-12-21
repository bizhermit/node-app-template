export const convertSizeNumToStr = (value?: string | number | null, nullValue?: string) => {
  if (value == null) return nullValue ?? undefined;
  if (typeof value === "string") return value;
  return `${convertPxToRemNum(value)!}rem`;
};

const pxPerRem = () => {
  if (typeof window === "undefined") return 10;
  return Number(parseFloat(getComputedStyle(document.documentElement).fontSize));
};

export const convertPxToRemNum = (value?: number) => {
  if (value == null) return undefined;
  return value / pxPerRem();
};

export const convertRemToPxNum = (value?: number) => {
  if (value == null) return undefined;
  return value * pxPerRem();
};